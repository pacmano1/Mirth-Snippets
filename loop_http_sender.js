// Import necessary Apache HTTP packages for HTTP client operations
importPackage(Packages.org.apache.http.client, 
              Packages.org.apache.http.client.methods, 
              Packages.org.apache.http.impl.client, 
              Packages.org.apache.http.message, 
              Packages.org.apache.http.client.entity, 
              Packages.org.apache.http.entity, 
              Packages.org.apache.http.util);

// Initialize an array to store the physicians data
$c('array_of_physicians', []);

// Set the initial URL for the API request
$c('next_url', $c('api_base_url') + '/physicians');

// Initialize a counter for the number of requests made
var j = 0;

// Define the maximum number of retries for the API request loop
const MAX_RETRIES = 10;

// Loop to fetch data from the API as long as there is a next URL and the maximum retries have not been exceeded
while ($c('next_url') != null && j < MAX_RETRIES) {
    j++;  // Increment the request counter
    
    // Create a new HTTP client and a GET request for the current URL
    var httpclient = new DefaultHttpClient();
    var httpGet = new HttpGet($c('next_url'));
    httpGet.addHeader('Authorization', $co('token'));  // Add authorization header to the request

    var resp = null;  // Initialize the response variable
    try {
        // Execute the GET request and capture the response
        resp = httpclient.execute(httpGet);
        var statusCode = resp.getStatusLine().getStatusCode();  // Get the HTTP status code from the response
        var entity = resp.getEntity();  // Get the response entity
        var responseString = EntityUtils.toString(entity, "UTF-8");  // Convert the entity to a string
        
        // Store the response string and status code for debugging or logging
        $c("responseString_" + j, responseString);
        $c("statusCode_" + j, statusCode);

        // Check if the request was unsuccessful and throw an error if so
        if (statusCode >= 300) {
            throw responseString;
        }

        // Parse the JSON response and add the physicians data to the array
        var responseJson = JSON.parse(responseString);
        $c('array_of_physicians', $c('array_of_physicians').concat(responseJson.results));
        
        // Update the next URL for pagination, if available
        $c('next_url', responseJson.next);

    } catch (err) {
        // Log any errors encountered and rethrow them
        logger.debug(err);
        throw err;
    } finally {
        // Ensure the response and client are closed
        if (resp != null) {
            resp.close();
        }
        httpclient.close();
    }
}
