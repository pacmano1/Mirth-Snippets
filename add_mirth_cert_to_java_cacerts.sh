#!/usr/bin/env bash
# -------------------------------------------------------------------
# Import Mirth Connect's HTTPS cert (from its JKS keystore) into a JVM
# cacerts truststore, without keytool warnings.
#
# How this avoids the "-cacerts" warning:
#   - We call the keytool from the *target JRE* (JAVA_HOME_FOR_CACERTS/bin/keytool)
#   - We pass -cacerts (so keytool uses that JRE's default truststore)
#   - Thus, no "use -cacerts" nag, and you still control which cacerts via JAVA_HOME_FOR_CACERTS
# -------------------------------------------------------------------

set -euo pipefail

### ===== Configurable =====
# Path to mirth.properties (to discover keystore path & password)
MIRTH_PROPS="/usr/local/mirthconnect/conf/mirth.properties"

# Which JRE's cacerts to modify (this controls which cacerts is used)
# Set to the JRE whose cacerts you want to update.
JAVA_HOME_FOR_CACERTS="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"

# Passwords & alias used in cacerts
CACERTS_PASS="changeit"
ALIAS_IN_CACERTS="mirth-selfsigned"

# Backup timestamp
BACKUP_SUFFIX="$(date +%F_%H%M%S)"
### ========================

# --- Derived paths / tools ---
KEYTOOL_MIRTH="keytool"                                # any keytool for reading Mirth's keystore
KEYTOOL_CACERTS="${JAVA_HOME_FOR_CACERTS}/bin/keytool" # keytool tied to the target JRE (for -cacerts)
CACERTS_FILE="${JAVA_HOME_FOR_CACERTS}/lib/security/cacerts"

# --- Sanity checks ---
command -v "$KEYTOOL_MIRTH" >/dev/null || { echo "Missing keytool in PATH"; exit 1; }
[ -x "$KEYTOOL_CACERTS" ] || { echo "Not executable: $KEYTOOL_CACERTS (check JAVA_HOME_FOR_CACERTS)"; exit 1; }

[ -r "$MIRTH_PROPS" ]  || { echo "Not readable: $MIRTH_PROPS"; exit 1; }
[ -f "$CACERTS_FILE" ] || { echo "cacerts not found: $CACERTS_FILE"; exit 1; }
[ -r "$CACERTS_FILE" ] || { echo "cacerts not readable: $CACERTS_FILE"; exit 1; }

# --- Property reader (ignores comments, trims spaces) ---
prop() {
  awk -F'=' -v key="$1" '
    /^[[:space:]]*#/ {next}
    NF>=2 {
      k=$1; v=$0; sub(/^[^=]*=/,"",v)
      gsub(/^[ \t]+|[ \t]+$/,"",k)
      gsub(/^[ \t]+|[ \t]+$/,"",v)
      if (k==key) { print v; exit }
    }' "$MIRTH_PROPS"
}

# --- Pull keystore settings from mirth.properties ---
DIR_APPDATA="$(prop dir.appdata || true)"
KS_PATH_RAW="$(prop keystore.path || true)"
KS_STOREPASS="$(prop keystore.storepass || true)"
KS_STOREPASS="${KS_STOREPASS:-changeit}"   # default if not set

# Resolve keystore path (handles ${dir.appdata})
if [[ -n "${KS_PATH_RAW:-}" ]]; then
  if [[ "$KS_PATH_RAW" == *'${dir.appdata}'* && -n "$DIR_APPDATA" ]]; then
    MIRTH_KEYSTORE="${KS_PATH_RAW//'${dir.appdata}'/$DIR_APPDATA}"
  else
    MIRTH_KEYSTORE="$KS_PATH_RAW"
  fi
else
  MIRTH_KEYSTORE="/opt/mirthconnect/conf/keystore.jks"  # fallback
fi
[ -r "$MIRTH_KEYSTORE" ] || { echo "Keystore not readable: $MIRTH_KEYSTORE"; exit 1; }

echo "mirth.properties : $MIRTH_PROPS"
echo "Mirth keystore   : $MIRTH_KEYSTORE (type: JKS)"
echo "Target JRE       : $JAVA_HOME_FOR_CACERTS"
echo "Target cacerts   : $CACERTS_FILE"
echo

# --- Detect alias to export (prefer PrivateKeyEntry) ---
mapfile -t private_aliases < <("$KEYTOOL_MIRTH" -list -v \
  -keystore "$MIRTH_KEYSTORE" -storepass "$KS_STOREPASS" 2>/dev/null \
  | awk '
      /^Alias name: /{alias=$3}
      /^Entry type: PrivateKeyEntry$/ { print alias }')

if [[ "${#private_aliases[@]}" -gt 0 ]]; then
  MIRTH_ALIAS="${private_aliases[0]}"
else
  MIRTH_ALIAS="$("$KEYTOOL_MIRTH" -list -keystore "$MIRTH_KEYSTORE" -storepass "$KS_STOREPASS" 2>/dev/null \
    | awk -F': ' '/^Alias name: /{print $2; exit}')"
  MIRTH_ALIAS="${MIRTH_ALIAS:-mirthconnect}"
fi

echo "Using alias       : $MIRTH_ALIAS"
echo

# --- Compute source cert SHA-256 fingerprint (for idempotency) ---
SRC_FP="$("$KEYTOOL_MIRTH" -list -v \
  -keystore "$MIRTH_KEYSTORE" -storepass "$KS_STOREPASS" -alias "$MIRTH_ALIAS" 2>/dev/null \
  | awk -F': ' '/SHA256:/{print $2; exit}')"
if [[ -z "$SRC_FP" ]]; then
  echo "Error: Could not compute source certificate SHA-256 fingerprint."
  exit 1
fi

# --- If identical cert already in cacerts, skip import ---
if "$KEYTOOL_CACERTS" -list -v -cacerts -storepass "$CACERTS_PASS" 2>/dev/null \
   | grep -q "SHA256: $SRC_FP"; then
  echo "Info: Identical certificate already present in cacerts (SHA256: $SRC_FP). Skipping import."
  exit 0
fi

# --- Backup cacerts (file) ---
BACKUP_FILE="${CACERTS_FILE}.bak.${BACKUP_SUFFIX}"
cp "$CACERTS_FILE" "$BACKUP_FILE"
echo "Backup created    : $BACKUP_FILE"

# --- Export cert from Mirth's keystore to temp PEM ---
CRT_FILE="$(mktemp /tmp/mirth.XXXXXX.crt)"
cleanup(){ rm -f "$CRT_FILE"; }
trap cleanup EXIT

echo "Exporting certificate from keystore..."
"$KEYTOOL_MIRTH" -exportcert -rfc \
  -alias "$MIRTH_ALIAS" \
  -keystore "$MIRTH_KEYSTORE" -storepass "$KS_STOREPASS" \
  -file "$CRT_FILE" >/dev/null

# --- Import into cacerts via the TARGET JRE's keytool (-cacerts => no warning) ---
"$KEYTOOL_CACERTS" -delete -alias "$ALIAS_IN_CACERTS" -cacerts -storepass "$CACERTS_PASS" >/dev/null 2>&1 || true

echo "Importing into cacerts as alias '$ALIAS_IN_CACERTS'..."
"$KEYTOOL_CACERTS" -importcert -noprompt -trustcacerts \
  -alias "$ALIAS_IN_CACERTS" \
  -file "$CRT_FILE" \
  -cacerts -storepass "$CACERTS_PASS" >/dev/null

# --- Verify by fingerprint (most reliable) ---
if "$KEYTOOL_CACERTS" -list -v -cacerts -storepass "$CACERTS_PASS" 2>/dev/null \
   | grep -q "SHA256: $SRC_FP"; then
  echo "Success: certificate present in cacerts (SHA256: $SRC_FP)."
else
  echo "Warning: certificate not found in cacerts after import."
fi

echo "Done."
echo "Restore if needed: cp '$BACKUP_FILE' '$CACERTS_FILE'"
