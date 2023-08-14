/**
 * This code handles database connection pooling and basic querying operations. 
 * Courtesy of DavidM from the Mirth Slack community.
 */

///////////////////////////////////////////////////////////////////////
// Connection pooling setup 
// You might want to organize this part based on where you want these blocks to reside, 
// for example, the function definitions might be more suited in code templates.
///////////////////////////////////////////////////////////////////////

// Constants
var dbConnName = 'OurDBConnectionName';
var OurDB_str = 'OurDB-Connection';

// Define the database connection details
// Save these connection details to the Global Map, so they can be retrieved by code templates as needed
globalMap.put(dbConnName, {
    mapkey: OurDB_str,
    driver: 'com.mysql.jdbc.Driver', // Note: Deprecated, consider updating to com.mysql.cj.jdbc.Driver for versions 3.8.0 and above
    url: 'jdbc:mysql://127.0.0.1:3306/super_database?verifyServerCertificate=true&useSSL=true&requireSSL=true',
    username: 'mysql_app_user',
    password: 'superstrongpassword',
    validation_query: 'SELECT 1',
    initialSize: 1,
    maxTotal: 10,
    maxIdle: 1,
    minIdle: 1,
    test: true,
    maxRetries: 2,
    reconnectWaitSeconds: 5
});

// Check if a connection pool already exists
var pool = globalMap.get(OurDB_str);

// If there's no connection pool, create one
if (pool == null) {
    var connDetails = globalMap.get(dbConnName);
    logger.info("Attempting new pool on " + connDetails['url']);
    try {
        pool = new Packages.org.apache.commons.dbcp2.BasicDataSource();
        globalMap.put(OurDB_str, pool);
        pool.setDriverClassName(connDetails['driver']);
        pool.setUsername(connDetails['username']);
        pool.setPassword(connDetails['password']);
        pool.setUrl(connDetails['url']);
        pool.setInitialSize(connDetails['initialSize']);
        pool.setMaxTotal(connDetails['maxTotal']);
        pool.setMaxIdle(connDetails['maxIdle']);
        pool.setMinIdle(connDetails['minIdle']);
        pool.setTestOnReturn(connDetails['test']);
        pool.setValidationQuery(connDetails['validation_query']);
    } catch(e) {
        logger.error("Error creating new pool to "+ connDetails['url'] + " - " + e.toString());
        pool = null;
        globalMap.remove(OurDB_str); 
    }
}

///////////////////////////////////////////////////////////////////////
// Function to obtain a database connection
///////////////////////////////////////////////////////////////////////
function getDBConn(connDetails) {
    var pool = globalMap.get(connDetails['mapkey']);
    var maxRetries = connDetails['maxRetries'];
    var connected = false;
    var connection = null;
    var countRetry = 0;
    var wait = connDetails['reconnectWaitSeconds'];
    
    while ((countRetry < maxRetries) && !connected ) {
        countRetry++;
        try {
            if (pool === null) {
                logger.error("The pool is null - this should not have happened. Investigate.");
                pool = createDBCP(connDetails);
            }
            connection = pool.getConnection();
            connected = true;
        } catch (e) {
            logger.error("Exception while connecting - waiting " + wait + " seconds");
            logger.error(e);
            connection = null;
            closeDBCP(connDetails);
            java.lang.Thread.sleep(wait * 1000);
        }
    }
    
    return connection; 
}

///////////////////////////////////////////////////////////////////////
// Function to close the connection pool when done
///////////////////////////////////////////////////////////////////////
function closeDBCP(connDetails) {
    var pool = globalMap.get(connDetails['mapkey']);
    logger.error("Closing pool " + pool + " before null check.");
    
    if (pool !== null) {
        try {
            pool.close();
            pool = null;
            globalMap.remove(connDetails['mapkey']);
            logger.info("DBCP closed to " + connDetails['url']);
        } catch(e) {
            logger.error("Exception closing DBCP was " + e);
            logger.error("DBCP close failed for " + connDetails['url']);
        }
    }
}

///////////////////////////////////////////////////////////////////////
// Function to query the database
///////////////////////////////////////////////////////////////////////
function queryDB(sql) {
    var channelName = typeof channelId != 'undefined' ? ChannelUtil.getDeployedChannelName(channelId) : 'N/A';
    var connDetails = globalMap.get("OurDBConnectionName");
    var dbConn = getDBConn(connDetails);
    
    if (dbConn === null) {
        logger.error(channelName + " queryDB - dbconn is null disconnected.");
    } else {
        try {
            var statement = dbConn.createStatement();
            var result = statement.executeQuery(sql);
            
            // Create MirthCachedRowSet, then allow connection to close, so result is released for use
            var ourRowSet = new MirthCachedRowSet();
            ourRowSet.populate(result);
            return ourRowSet;
        } catch (ex) {
            logger.error(channelName + " Exception on expression:" + ex);
        } finally {
            // Always ensure resources are closed after use
            statement.close();
            if (result != null) {
                result.close();
            }
            dbConn.close();
        }
    }
    
    return null;
}
