/**
 * Generates a JWT for Epic FHIR server authentication.
 * Requires https://raw.githubusercontent.com/kjur/jsrsasign/master/jsrsasign-all-min.js as a codetemplate
 * Tested with version 10.7.0
 * IMPORTANT In the code template you added you must add this near the top because this library can be used with browsers.
 * var navigator = window = {}  // fake the fact we have no browser otherwise function will fail with 'ReferenceError: "navigator" is not defined'
 *
 * On Epic dev portal, you will need to upload your public key, their documentation is clear 
 * on generating your required rsa private and public keys and retreive your ClientID
 *
 * Using an http sender
 * URL: https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token
 * Method: POST
 * Content Type: application/x-www-form-urlencoded
 * Query paramenters:
 * * grant_type                               client_credentials
 * * client_assertion_type                    urn:ietf:params:oauth:client-assertion-type:jwt-bearer
 * * client_assertion                         ${jwt}
 * 
 *
 * @function generateEpicFhirJWT
 * @param {string} clientId - Your client ID from the Epic portal.
 * @param {string} privateKey - Your private RSA key.
 * @returns {string} - The generated JWT.
 *
 * @example
 * const clientId = "<your client id from portal>";
 * const privateKey = $cfg('jwt_secret') + '';
 * const jwt = generateEpicFhirJWT(clientId, privateKey);
 * // Use jwt in your http request to the Epic FHIR server.
 */
function generateEpicFhirJWT(clientId, privateKey) {
    // Time
    const iat = Math.floor(Date.now() / 1000);

    // Set up the JWT header and payload
    const header = {
        "alg": "RS256",
        "typ": "JWT"
    };

    const payload = {
        "iss": clientId,
        "sub": clientId,
        "aud": "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
        "jti": "some UUID here",
        "exp": iat + 299,
        "iat": iat
    };

    // Generate the JWT
    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sKey = KEYUTIL.getKey(privateKey);

    const jwt = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, sKey);

    return jwt;
}
