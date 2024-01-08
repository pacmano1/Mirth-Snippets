// Import required classes from the SSH library, 
// this uses https://github.com/hierynomus/sshj, you must add this as a channel dependency.
var PromiscuousVerifier = net.schmizz.sshj.transport.verification.PromiscuousVerifier;
var SSHClient = net.schmizz.sshj.SSHClient;
var SFTPClient = net.schmizz.sshj.sftp.SFTPClient;
var File = java.io.File;

// Define a function for SFTP file transfer
function sftpFileTransfer(serverName, userName, password, from_file_name, to_file_name) {
    var ssh = new SSHClient();
    var file_sent = false;

    try {
        // Connect to the SSH server
        ssh.connect(serverName);

        // Configure the host key verifier (remove in production, as it's not secure)
        ssh.addHostKeyVerifier(new PromiscuousVerifier());

        // Authenticate using password (for private key, use ssh.authPublickey)
        ssh.authPassword(userName, password);

        // Create an SFTP client
        var sftp = ssh.newSFTPClient();

        try {
            // Upload a file from the local system to the remote server
            sftp.put(from_file_name, to_file_name);
            file_sent = true; // Mark the file as sent
        } finally {
            // Close the SFTP client
            sftp.close();
        }
    } finally {
        // Disconnect and close the SSH client
        ssh.disconnect();
        ssh.close();
    }

    return file_sent; // Return true if the file was sent successfully
}

// Usage example:
var serverName = 'sftp.someserver.com';
var userName = 'someuser';
var password = 'somepassword';
var from_file_name = 'fromSomefile.txt';
var to_file_name = 'toSomefile.txt';

var fileSent = sftpFileTransfer(serverName, userName, password, from_file_name, to_file_name);

if (fileSent) {
    logger.info('File sent successfully.');
} else {
    logger.error('File transfer failed.');
}
