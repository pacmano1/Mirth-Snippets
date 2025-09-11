// Copyright (c) [2024] [Diridium Technologies Inc.  https://diridium.com]
// 
/**
 * This function generates a JSON Web Token (JWT) 
 * for communication with EPIC's FHIR (Fast Healthcare Interoperability Resources) server.   (That was the specific use case)
 * IMPORTANT: most RSA keys are in the wrong format, use:
 * openssl pkcs8 -topk8 -inform PEM -outform PEM -in myprivatekey.pem -out my_private_key_pkcs8.pem -nocrypt
 * Or from scratch:
 * openssl genrsa -out myprivatekey.pem 2048
 * openssl pkcs8 -topk8 -inform PEM -outform PEM -in myprivatekey.pem -out my_private_key_pkcs8.pem -nocrypt
 * openssl rsa -in myprivatekey.pem -pubout -out epic-public.pem
 * IMPORTANT: Add https://github.com/pacmano1/Mirth-Snippets/blob/main/nimbus-jose-jwt.jar to a resource directory.
 * Under Settings... Resources create a Resoruce.  The resource directory you create (e.g. /opt/oie/jwt) needs gson-2.13.1.jar and nimbus-jose-jwt-10.3.1.jar 
 * @param {string} clientId - The client identifier for the system using the JWT for authorization.
 * @param {string} privateKey - The private key used to sign the JWT, in RSA format.
 * @param {string} jti - JSON Web Token ID, a unique identifier for the JWT.
 * @param {string} aud - The audience of the JWT, typically the URI of the server that will receive the JWT.
 * @param {string} alg - The JWS algorithm to be used for signing the JWT. Default is 'RS256'.
 *
 * @returns {string} - A serialized JSON Web Token.
 */
function generateEpicFhirNimbusJWT(clientId, privateKey, jti, aud, alg) {
    // Get current timestamp in seconds (epoch time)
    alg = alg || 'RS256'
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

    // Create the header using the JWS Algorithm passed in argument and the JWT id
    var header = jwsHeader.Builder(jwsAlgorithm[alg]).keyID(jti).build();

    // Create the JWT using the header and claims set
    var jwt = signedJWT(header, claimsSet);

    // Sign the JWT using the RSA signer
    jwt.sign(signer);

    // Return the serialized JWT
    return jwt.serialize();
}
