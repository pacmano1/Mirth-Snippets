/**
 * Creates a debug map function that conditionally logs values.
 * @param {Map} delegateMap - A map to store debug values.
 * @returns {Function} A function for conditional debugging.
 */
function createDebugMap(delegateMap) {
    /**
     * Debug function to log key-value pairs based on configuration settings.
     * @param {string} key - The key associated with the value or function to log.
     * @param {any|Function} valueOrFunc - The value or function to evaluate for logging.
     */
    return function $d(key, valueOrFunc) {
        // Check if general debugging is enabled or if it's enabled for a specific channel
        if ($cfg('debug-all') == "1" || $cfg('debug-' + channelId) == "1") {
            // Evaluate the value or function and assign it to `value`
            const value = typeof valueOrFunc == 'function' ? valueOrFunc() : valueOrFunc;
            // Store the key and evaluated value in the delegate map
            delegateMap.put(key, value);
        }
    }
}

// Usage Example

// Instantiate the debug map function with a specific map
var $d = createDebugMap(connectorMap);

// Log a value or the result of an expensive computation conditionally
$d('someValue', () => expensiveCompute(msg.a));
$d('otherValue', msg.b);

// Configuration Map
// Set 'debug-all' or specific channel debug flags to enable logging
debug-all = "1";
// or (for a specific channel)
debug-b5656dcd-38bc-4b4f-aebb-ac4d4789e26d = "1";
