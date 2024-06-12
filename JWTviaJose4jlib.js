// ******
// Note: I use https://github.com/pacmano1/Mirth-Snippets/blob/main/epicJWTusingNimbusJava.js
// ******
// I did not create this
// Posted by jcurry5 at https://github.com/nextgenhealthcare/connect/discussions/5503#discussioncomment-4031411
// jose4j security library required

///Create an OAuth channel that runs every 4 minutes to generate a new JWT

///Destination tab:
//I have a query parameter for 'client_assertation' that has a variable of ${JWT}
//Create a new transformer as a JavaScript type
// Code:


var encoded;
var keySpec;
var claims = new Packages.org.jose4j.jwt.JwtClaims();
var jws = new Packages.org.jose4j.jws.JsonWebSignature();
var keyFac = java.security.KeyFactory.getInstance("RSA");
var privateKey;

encoded = Packages.org.apache.commons.codec.binary.Base64.decodeBase64("");
keySpec = new Packages.java.security.spec.PKCS8EncodedKeySpec(encoded);
privateKey = keyFac.generatePrivate(keySpec);

claims.setGeneratedJwtId();
claims.setIssuer('');
claims.setSubject('');

claims.setNotBeforeMinutesInThePast(1);
claims.setExpirationTimeMinutesInTheFuture(4);
claims.setIssuedAtToNow();
claims.setAudience("");

jws.setHeader('typ', 'JWT');
jws.setKey(privateKey);
jws.setPayload(claims.toJson());
jws.setAlgorithmHeaderValue(org.jose4j.jws.AlgorithmIdentifiers.RSA_USING_SHA384);

globalMap.put('JWT', jws.getCompactSerialization());`


//Create a new Response:
//JavaScript type
//Code:
var access_token = msg['access_token']; globalMap.put('access_token',access_token);

//In a different channel that performs the heavy lifting, I have a destination with an Authorization query parameter that references the access_token global variable:
Bearer ${access_token}
