/**
 * This function generates a JSON Web Token (JWT) following the JOSE (Javascript Object Signing and Encryption) standard 
 * for communication with EPIC's FHIR (Fast Healthcare Interoperability Resources) server.
 * IMPORTANT, most RSA keys are in the wrong format, use:
 * openssl pkcs8 -topk8 -inform PEM -outform PEM -in myprivatekey.pem -out my_private_key_pkcs8.pem -nocrypt
 * 
 * @param {string} clientId - The client identifier for the system using the JWT for authorization.
 * @param {string} privateKey - The private key used to sign the JWT, in RSA format
 * @param {string} jti - JSON Web Token ID, a unique identifier for the JWT.
 * @param {string} aud - The audience of the JWT, typically the URI of the server that will receive the JWT.
 *
 * @returns {string} - A serialized JSON Web Token.
 */
function generateEpicFhirJoseJWT(clientId, privateKey, jti, aud) {
    // Get current timestamp in seconds (epoch time)
    var iat = Math.floor(new Date().getTime() / 1000);

    // Remove any non-base64 characters from the private key
    var base64PrivateKey = privateKey.replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

    // Java imports for JOSE and JWT handling
    var signedJWT = Packages.com.nimbusds.jwt.SignedJWT;
    var jwsHeader = Packages.com.nimbusds.jose.JWSHeader;
    var jwsAlgorithm = Packages.com.nimbusds.jose.JWSAlgorithm;
    var jwsSigner = Packages.com.nimbusds.jose.crypto.RSASSASigner;
    var jwtClaimsSet = Packages.com.nimbusds.jwt.JWTClaimsSet;
    
    // Java imports for RSA private key generation
    var keyFactory = java.security.KeyFactory.getInstance("RSA");
    var base64Decoder = java.util.Base64.getDecoder();
    var privateKeyBytes = base64Decoder.decode(base64PrivateKey);
    var privateKeySpec = new java.security.spec.PKCS8EncodedKeySpec(privateKeyBytes);
    var RSAPrivateKey = keyFactory.generatePrivate(privateKeySpec);

    // Create RSA signer with private key
    var signer = new jwsSigner(RSAPrivateKey);

    // Prepare JWT with claims set, including issuer, subject, audience, unique ID, expiration time, and issued time
    var claimsSet = jwtClaimsSet.Builder()
        .issuer(clientId)
        .subject(clientId)
        .audience(aud)
        .jwtID(jti)
        .expirationTime(new java.util.Date((iat + 299) * 1000))
        .issueTime(new java.util.Date(iat * 1000))
        .build();

    // Create the header using the JWS Algorithm RS256 and the JWT id
    var header = jwsHeader.Builder(jwsAlgorithm.RS256).keyID(jti).build();

    // Create the JWT using the header and claims set
    var jwt = signedJWT(header, claimsSet);

    // Sign the JWT using the RSA signer
    jwt.sign(signer);

    // Return the serialized JWT
    return jwt.serialize();
}
