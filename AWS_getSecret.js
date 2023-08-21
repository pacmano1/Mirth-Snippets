/**
 * AWS Secrets Manager integration for Mirth.
 * 
 * This script provides a function to retrieve secrets from AWS Secrets Manager.
 * Author: Josh McDonald
 * 
 * Prerequisites:
 * - Make sure to import the necessary AWS SDK packages.
 * - Add the required JAR dependency (secretsmanager-2.xx.xx.jar) to your Mirth instance.
 */

// Required imports for AWS SDK and Secrets Manager.
// Uncomment these if running outside the Mirth environment or if direct imports are preferred.
// import software.amazon.awssdk.regions.Region;
// import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
// import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
// import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

/**
 * Retrieves the secret value from AWS Secrets Manager for a given secret name and region.
 *
 * @param {string} secretName - The name or ARN of the secret.
 * @param {string} regionName - The AWS region where the secret is stored (e.g., "us-east-2").
 * @returns {Object} - Parsed secret string in JSON format.
 */
function getSecret(secretName, regionName) {
    // Initialize the region based on the provided region name.
    var region = Packages.software.amazon.awssdk.regions.Region.of(regionName);
    
    // Create a Secrets Manager client with the specified region.
    var client = Packages.software.amazon.awssdk.services.secretsmanager.SecretsManagerClient.builder()
       .region(region)
       .build();
    
    // Build a request to fetch the secret value.
    var getSecretValueRequest = Packages.software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest.builder()
       .secretId(secretName)
       .build();
    
    var getSecretValueResponse;
    
    try {
        // Attempt to retrieve the secret value.
        getSecretValueResponse = client.getSecretValue(getSecretValueRequest);
    } 
    catch (e) {
        // If any exceptions are thrown during the secret retrieval, re-throw them for the caller to handle.
        // More details about possible exceptions can be found at:
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw e;
    }
    
    // Return the secret value as a parsed JSON object.
    return JSON.parse(getSecretValueResponse.secretString());
}
