// Note - stub function here that does work - but adapt ciphers and 
// session.setConfig("StrictHostKeyChecking", "no") should not be set at all.

// Import required classes from the JSch library
var JSch = com.jcraft.jsch.JSch;
var Session = com.jcraft.jsch.Session;

function sftpFileTransferGet(serverName, port, userName, password, privateKeyPath, fromFileName, mimeType, base64encode) {
    var jsch = new JSch();
    var fileTransferred = false;
    var session = null;

    // Set up the session
    if (privateKeyPath) {
        jsch.addIdentity(privateKeyPath);
    }
    session = jsch.getSession(userName, serverName, port);

    if (password) {
        session.setPassword(password);
    }

    // Configure the host key verifier (remove in production, as it's not secure)
    session.setConfig("StrictHostKeyChecking", "no");

    // Configure the cipher algorithms to match the server's supported algorithms you may not need these.
    session.setConfig("cipher.s2c", "aes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,aes256-gcm@openssh.com,chacha20-poly1305@openssh.com");
    session.setConfig("cipher.c2s", "aes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,aes256-gcm@openssh.com,chacha20-poly1305@openssh.com");

    session.connect();

    // Create an SFTP channel
    var channel = session.openChannel("sftp");
    channel.connect();
    var sftp = channel;

    var inputStream = sftp.get(fromFileName);
    var fileContent = org.apache.commons.io.IOUtils.toByteArray(inputStream);
    inputStream.close()

    addAttachment(fileContent, mimeType, base64encode) 

    fileTransferred = true; // Mark the file as transferred

    // Disconnect and close the SFTP channel
    sftp.disconnect();
    // Disconnect and close the SSH session
    session.disconnect();

    return fileTransferred; // Return true if the file was transferred successfully
}

// Using username/password authentication for upload
var serverName1 = 'some.domain.com';
var userName1 = 'username';
var password1 = 'password';
var privateKeyPath1 = null;
var fromFileName1 = '/tmp/junk.txt';

var fileGet = sftpFileTransferGet(serverName1, 22, userName1, password1, privateKeyPath1, fromFileName1, 'text/plain', false);
