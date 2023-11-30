/**
 * Moves a file from a source path to a destination path.
 * If the destination filename is omitted, the source filename is used.
 * 
 * @param {string} sourceFilePath - The full file path including the filename in the source directory.
 * @param {string} destPath - The destination directory path or the full file path including the filename.
 * @returns {void} This function does not return a value.
 * @throws Will throw an error if the file cannot be moved, e.g., file does not exist, or permissions are insufficient.
 */
function moveFile(sourceFilePath, destPath) {
    var sourceFile = new java.io.File(sourceFilePath);
    var destFile;

    // Check if the destination path is a directory or a file path
    var dest = new java.io.File(destPath);
    if (dest.exists() && dest.isDirectory()) {
        // If destPath is a directory, use the source filename in the destination directory
        destFile = new java.io.File(dest, sourceFile.getName());
    } else {
        // If destPath includes the filename, use it as the destination file path
        destFile = dest;
    }

    // Move the file to the destination path
    org.apache.commons.io.FileUtils.moveFile(sourceFile, destFile);
}

// Example calls to the moveFile function:
// Moves 'report.pdf' from 'C:/temp/reports' to 'D:/archive/reports' with the filename 'report.pdf'
try {
    moveFile("C:/temp/reports/report.pdf", "D:/archive/reports");
} catch (e) {
    console.log("Error occurred during file move: " + e.message);
}

// Moves 'report.pdf' from 'C:/temp/reports' to 'D:/archive/reports' with a new filename 'archived_report.pdf'
try {
    moveFile("C:/temp/reports/report.pdf", "D:/archive/reports/archived_report.pdf");
} catch (e) {
    console.log("Error occurred during file move: " + e.message);
}
