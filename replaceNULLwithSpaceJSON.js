// courtesy of Tony Germano from Mirth Slack.  recursively replaces a null with an empty string.
msg = JSON.parse(JSON.stringify(msg), (k,v) => v === null ? "" : v)
