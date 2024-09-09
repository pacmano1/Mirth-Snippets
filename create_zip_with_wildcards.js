// Copyright (c) [2024] [Diridium Technologies Inc.  https://diridium.com]
// 
// Import necessary Java classes
var File = Packages.java.io.File;
var FileInputStream = Packages.java.io.FileInputStream;
var FileOutputStream = Packages.java.io.FileOutputStream;
var ZipEntry = Packages.java.util.zip.ZipEntry;
var ZipOutputStream = Packages.java.util.zip.ZipOutputStream;
var FilenameFilter = Packages.java.io.FilenameFilter;

// Function to zip a directory based on wildcard pattern
function zipDirectory(zipFilePath, directoryWithWildcards) {
    // Get the file separator for the current system
    var separator = File.separator;
    
    // Extract the directory path and file pattern from the input
    var directoryPath = directoryWithWildcards.substring(0, directoryWithWildcards.lastIndexOf(separator));
    var pattern = directoryWithWildcards.substring(directoryWithWildcards.lastIndexOf(separator) + 1);

    // Create a File object for the directory
    var dir = new File(directoryPath);
    
    // List files in the directory matching the pattern
    var files = dir.listFiles(new FilenameFilter() {
        accept: function(dir, name) {
            return name.matches(pattern.replace("*", ".*")); // Convert wildcard to regex pattern
        }
    });

    // Initialize file output streams for the zip file
    var fos = new FileOutputStream(zipFilePath);
    var zos = new ZipOutputStream(fos);

    // Iterate through the files and add them to the zip
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fis = new FileInputStream(file);
        var zipEntry = new ZipEntry(file.getName());
        zos.putNextEntry(zipEntry);

        // Create a buffer to read the file
        var bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024); // Correctly specifying byte array
        var length;
        while ((length = fis.read(bytes)) >= 0) {
            zos.write(bytes, 0, length);
        }

        // Close the file input stream and the zip entry
        fis.close();
        zos.closeEntry();
    }

    // Close the zip output stream and file output stream
    zos.close();
    fos.close();
}

// Example usage of the zipDirectory function
var zipFilePath = '/tmp/junk.zip';
var directoryWithWildcards = '/tmp/junk/*.txt';
zipDirectory(zipFilePath, directoryWithWildcards);
