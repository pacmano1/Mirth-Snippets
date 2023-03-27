// Add to code templates https://raw.githubusercontent.com/kjur/jsrsasign/master/jsrsasign-all-min.js
// Tested with version 10.7.0 

// IMPORTANT In the code template you added you must add this near the top because this library can be used with browsers.
// var navigator = {}  // fake the fact we have no browser
// var window = {}     //

// On Epic dev portal, you will need to upload your public key, their documentation is clear 
// on generating your required rsa private and public keys and retreive your ClientID

// Transformer code:

// time
const iat = Math.floor(Date.now() / 1000);

// Set up the JWT header and payload
var header =
    {
        "alg": "RS256",
        "typ": "JWT"
    };

var privateKey = $cfg('jwt_secret') + ''  // our private key is in $cfg, again Epic portal is clear on generating this

var payload =
    {
        "iss": "<your client id from portal>",
        "sub": "<same client id as above>",
        "aud": "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
        "jti": "some UUID here",
        "exp": iat + 299,
        "iat": iat
    }

// Generate the JWT

var sHeader = JSON.stringify(header);
var sPayload = JSON.stringify(payload);
var sKey = KEYUTIL.getKey(privateKey);

var jwt = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, sKey);

$c('jwt', jwt);  // will be used on http call.

// Using an http sender
// URL: https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token
// Method: POST

// Query paramenters:
// grant_type                               client_credentials
// client_assertion_type                    urn:ietf:params:oauth:client-assertion-type:jwt-bearer
// client_assertion                         ${jwt}

// Content Type
// x-www-form-urlencoded



