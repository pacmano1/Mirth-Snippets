/**
 * Extracts attachment content from a token string and retrieves the attachment data.
 * 
 * Token format expected: ${ATTACH:id:index:type}
 * Where:
 *   - id: attachment identifier
 *   - index: numeric index of the attachment
 *   - type: attachment type/format
 * 
 * @param {string} token - The attachment token to parse (e.g., "${ATTACH:abc123:0:image}")
 * @param {boolean} asBase64 - Optional. Whether to return content as base64. Defaults to false.
 * @return {string} The attachment content as a string
 */
function getAttachmentFromToken(token, asBase64) {
    // Set default value for asBase64 parameter if not provided
    // In Rhino JS, we can't use ES6 default parameters
    if (typeof asBase64 === 'undefined') {
        asBase64 = false;
    }
    
    // Parse the token by removing the wrapper syntax
    // Remove the opening "${ATTACH:" prefix
    // Remove the closing "}" suffix
    // Split by ":" to get individual components
    var parts = token.replace('${ATTACH:', '').replace('}', '').split(':');
    
    // Extract the parsed components:
    // parts[0] = attachment ID
    // parts[1] = attachment index (convert to integer)
    // parts[2] = attachment type
    // parts[3] would be additional parameters if they exist
    
    // Call the getAttachment function with parsed parameters
    // - parts[0]: attachment ID
    // - parseInt(parts[1]): attachment index as integer
    // - parts[2]: attachment type
    // - asBase64: boolean flag for content encoding
    // Then call getContentString() on the returned attachment object
    return getAttachment(parts[0], parseInt(parts[1]), parts[2], asBase64).getContentString();
}
