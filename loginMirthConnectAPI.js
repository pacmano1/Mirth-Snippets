/**
Courtesy of joshm from Mirth Slack

Logs in to Mirth's using the Mirth Connect REST API.
@param {string} url - The URL of the Mirth Connect REST API login endpoint.
@param {string} body - The login request body as a string.
@returns {string} - The JSESSIONID cookie value for the authenticated session.
@throws An error if the login request fails with a status code of 300 or above.
*/
function loginMirth(url, body, globalMapVarName) {
    // Set up basic credentials provider with Mirth Connect API credentials
    var provider = new Packages.org.apache.http.impl.client.BasicCredentialsProvider();
    var credentials = new Packages.org.apache.http.auth.UsernamePasswordCredentials(
        configurationMap.get("mirthAPIUsername")
        , configurationMap.get("mirthAPIPassword")
    );
    provider.setCredentials(Packages.org.apache.http.auth.AuthScope.ANY, credentials);
    // Set up SSL context with trust strategy for self-signed certificates
    var sslContext = Packages.org.apache.http.conn.ssl.SSLContexts.custom()
        .loadTrustMaterial(null, new Packages.org.apache.http.conn.ssl.TrustSelfSignedStrategy())
        .build();

    // Set up SSL socket factory with NoopHostnameVerifier to ignore hostname verification
    var sslsf = new Packages.org.apache.http.conn.ssl.SSLConnectionSocketFactory(
        sslContext
        , null
        , null
        , new Packages.org.apache.http.conn.ssl.NoopHostnameVerifier()
    );

    // Create HTTP client with SSL socket factory and basic credentials provider
    var httpClient = Packages.org.apache.http.impl.client.HttpClients.custom()
        .setSSLSocketFactory(sslsf)
        .setDefaultCredentialsProvider(provider)
        .build();

    // Create HTTP POST request with URL and request configuration
    var request = new Packages.org.apache.http.client.methods.HttpPost(url);
    request.setConfig(getRequestConfig());

    // Add headers to request
    request.addHeader('Content-type', 'application/x-www-form-urlencoded');
    request.addHeader('X-Requested-With', 'OpenAPI');
    request.addHeader('accept', 'application/xml');

    // Set request body if provided
    if (body != null) {
        var entity = new Packages.org.apache.http.entity.StringEntity(body);
        request.setEntity(entity);
    }

    // Execute HTTP POST request
    var resp = httpClient.execute(request);

    // Check response status code and reason
    var statusLine = resp.getStatusLine();
    var statusCode = statusLine.getStatusCode();
    var statusReason = statusLine.getReasonPhrase();
    if (statusCode >= 300) {
        logger.error('failed to call loginMirth, status = ' + statusReason + ', code = ' + statusCode);
        throw "Failed to execute HTTP Post. Status Code: " + statusCode + ". Reason: " + statusReason + ". Response: " + Packages.org.apache.commons.io.IOUtils.toString(resp.getEntity().getContent(), "UTF-8");
    }

    // Extract JSESSIONID cookie value from response header and store in global map
    var header = resp.getFirstHeader("Set-Cookie").getValue() + "";
    var jsession = header.split("=")[1].split(";")[0];
    globalMap.put(globalMapVarName, jsession);

    // Return JSESSIONID cookie value
    return jsession;
}
