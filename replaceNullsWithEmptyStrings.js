// Recursive function to replace null values with empty strings in a JSON object.
// Courtesy of Tony Germano from Mirth Slack.
// Usage: replaceNullsWithEmptyStrings(msg);

function replaceNullsWithEmptyStrings(obj) {
  return JSON.parse(JSON.stringify(obj), (key, value) => (value === null ? "" : value));
}

// Example usage:
// var msgWithNulls = { name: "John", age: null, address: { street: "123 Main St", city: null } };
// var msgWithoutNulls = replaceNullsWithEmptyStrings(msgWithNulls);
// logger.info(msgWithoutNulls);
