**Credits:** Solution by agermano (Tony Germano), discussion from Mirth Slack from question posed by Brodie Doman

# Enable JSch SFTP Logging in Mirth Connect

## Overview
Enable detailed SFTP connection logging (authentication, connections, failures) for Mirth Connect's SFTP File Reader/Writer connectors.

## Configuration Steps

### 1. Enable JSch Logger
Add this code to a **Deploy Script** (runs on channel deployment):
```javascript
// Enable JSch logging globally for all SFTP connections
if (!(com.jcraft.jsch.JSch.getLogger() instanceof com.jcraft.jsch.Log4j2Logger)) {
    com.jcraft.jsch.JSch.setLogger(new com.jcraft.jsch.Log4j2Logger())
}
```

### 2. Configure log4j2.properties
Add to `conf/log4j2.properties`:
```properties
# JSch SFTP logging
logger.JSch.name = com.jcraft.jsch.JSch
logger.JSch.level = DEBUG  # Use INFO for less verbose output
```

### 3. Restart Mirth Connect
Changes to log4j2.properties require a restart.

## Optional: Dynamic Toggle

Create a control channel with a JavaScript Writer destination:
```javascript
logger.info('logger before: {}', com.jcraft.jsch.JSch.getLogger())

if (connectorMessage.getEncodedData() == '1' && !(com.jcraft.jsch.JSch.getLogger() instanceof com.jcraft.jsch.Log4j2Logger)) {
    // Enable logging
    com.jcraft.jsch.JSch.setLogger(new com.jcraft.jsch.Log4j2Logger())
}
else if (connectorMessage.getEncodedData() == '0') {
    // Disable logging
    com.jcraft.jsch.JSch.setLogger(null)
}

logger.info('logger after: {}', com.jcraft.jsch.JSch.getLogger())
```

Send message "1" to enable, "0" to disable logging without restart.

## Notes
- Logs output to `mirth.log` by default
- DEBUG level is very verbose
- Logger is set globally for all SFTP connections
- Log file rotation is handled automatically by Mirth

