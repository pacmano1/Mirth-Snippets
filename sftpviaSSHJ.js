// Import required classes from the SSH library
// Needs sshj-0.35.0.jar and eddsa-0.3.0.jar as a custom resource for your channel.
var PromiscuousVerifier = net.schmizz.sshj.transport.verification.PromiscuousVerifier;
var SSHClient = net.schmizz.sshj.SSHClient;
var SFTPClient = net.schmizz.sshj.sftp.SFTPClient;
var File = java.io.File;

// Define a function for SFTP file transfer
function sftpFileTransfer(serverName, userName, password, privateKeyPath, from_file_name, to_file_name) {
    var ssh = new SSHClient();
    var file_sent = false;

    try {
        // Connect to the SSH server
        ssh.connect(serverName);

        // Configure the host key verifier (remove in production, as it's not secure)
        ssh.addHostKeyVerifier(new PromiscuousVerifier());

        if (privateKeyPath) {
            // Authenticate using private key
            ssh.authPublickey(userName, privateKeyPath);
        } else {
            // Authenticate using password
            ssh.authPassword(userName, password);
        }

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

// Usage examples:

// Using username/password authentication
var serverName1 = 'sftp.someserver.com';
var userName1 = 'someuser';
var password1 = 'somepassword';
var privateKeyPath1 = null;
var from_file_name1 = 'fromSomefile.txt';
var to_file_name1 = 'toSomefile.txt';

var fileSent1 = sftpFileTransfer(serverName1, userName1, password1, privateKeyPath1, from_file_name1, to_file_name1);

if (fileSent1) {
    logger.info('File sent successfully.');
} else {
    logger.error('File transfer failed.');
}

// Using private key authentication
var serverName2 = 'sftp.someserver.com';
var userName2 = 'someuser';
var privateKeyPath2 = 'path/to/private/key.pem';
var from_file_name2 = 'fromSomefile.txt';
var to_file_name2 = 'toSomefile.txt';

var fileSent2 = sftpFileTransfer(serverName2, userName2, null, privateKeyPath2, from_file_name2, to_file_name2);

if (fileSent2) {
    logger.info('File sent successfully.');
} else {
    logger.error('File transfer failed.');
}
