// Copyright (c) [2024] [Diridium Technologies Inc.  https://diridium.com]
// 
/**
 * Creates a directory if it does not already exist.
 * 
 * @param {String} dir - The path of the directory to create. Can be absolute or relative.
 * 
 * This function attempts to create the directory specified by the `dir` parameter.
 * It first checks if the directory already exists. If it does not, it tries to create the directory
 * and all necessary parent directories. If the directory cannot be created, logs an error message.
 */
function create_dir(dir) {
    var directory = new java.io.File(dir);
    if (!directory.exists()) {
        var created = directory.mkdirs();
        if (!created) {
            logger.error("Failed to create the directory.");
        }
        return;
    }
}
