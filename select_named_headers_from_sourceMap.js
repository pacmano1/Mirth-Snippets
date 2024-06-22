/**
 * Creates a LinkedHashMap from provided headers and header keys.
 * This function is based on original work by Tony Germano (@agermano) from Mirth Slack.
 *
 * @param {Object} headers - The headers object containing header lists.
 * @param {Array} headerKeys - An array of header keys to be included in the map.
 * @param {boolean} excludeNullValues - Flag to determine whether to exclude null values.
 * @returns {java.util.LinkedHashMap} - A LinkedHashMap with header keys and their corresponding last values.
 */
function createHeaderMap(headers, headerKeys, excludeNullValues) {
    // Initialize a new LinkedHashMap
    const headerMap = new java.util.LinkedHashMap();

    // Function to get the last value of a header key
    const keyToEntryWithLastValue = key => {
        const headerList = headers.getHeaderList(key);
        const value = headerList && headerList.get(headerList.size() - 1);
        return [key, value];
    }

    // Populate the headerMap based on the excludeNullValues flag
    if (excludeNullValues == true) {
        headerKeys.map(keyToEntryWithLastValue)
            .filter(entry => entry[1] != null)
            .forEach(entry => headerMap.put.apply(headerMap, entry));  
    } else {
        headerKeys.map(keyToEntryWithLastValue)
            .forEach(entry => headerMap.put.apply(headerMap, entry));  
    }

    // Return the populated LinkedHashMap
    return headerMap;
}

// Example usage:
const headers = $s('headers');
const headerKeys = ["host", "content-type", "date", "Authorization", "content-md5", "Accept"];
const headerMap = createHeaderMap(headers, headerKeys, false);
$co('headerMap',headerMap)
// In your sender, selct "Use Map" and type in "headerMap" (no double quotes, just the word)

