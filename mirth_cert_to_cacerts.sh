# example

# Grab the cert from the running instance
echo | openssl s_client -connect localhost:8443 -showcerts 2>/dev/null | openssl x509 -outform PEM > mirth-server.pem

# fix the path to cacerts and the password for your use case
keytool  -import -trustcacerts -alias mirth-server -file mirth-server.pem -keystore /usr/lib/jvm/java-17-openjdk-amd64/lib/security/cacerts -storepass changeit
