// Code Courtesy of DavidM from Mirth Slack

///////////////////////////////////////////////////////////////////////
// Included in Global Deploy
///////////////////////////////////////////////////////////////////////
var dbConnName = 'OurDBConnectionName';
var OurDB_str = 'OurDB-Connection';
// Place in Global Map to be retrieved by code templates as needed
globalMap.put(dbConnName, {
        mapkey: OurDB_str,
        driver: 'com.mysql.jdbc.Driver', // deprecated; consider updating this to com.mysql.cj.jdbc.Driver in 3.8.0+
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
// If a connection was established this will be a non-null
var pool = globalMap.get(OurDB_str);
if (pool == null) {
    var connDetails = globalMap.get(dbConnName);
        logger.info("Attempting new pool on " + connDetails['url']);
    try  {
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
    } catch(e)  {
        logger.error("Error creating new pool to "+ connDetails['url']
                + " - " + e.toString());
        pool=null;
        globalMap.remove(OurDB_str); 
    }
}
///////////////////////////////////////////////////////////////////////
// Obtain a database connection
///////////////////////////////////////////////////////////////////////
function getDBConn(connDetails)  {
    var pool = globalMap.get(connDetails['mapkey']);
    var maxRetries = connDetails['maxRetries'];
    var connected = false;
    var connection = null;
    var countRetry = 0;
    var wait = connDetails['reconnectWaitSeconds'];
    while ((countRetry < maxRetries) && !connected ) {
        countRetry ++;
        try {
            if ( pool === null ) { // Should never happen; this exists for elegant handling.
                logger.error("The pool is null - this should not have happened. Investigate.")
                pool = createDBCP(connDetails);
            }
            connection = pool.getConnection();
            connected=true;
        }
        catch (e) {
            logger.error("Exception while connecting - waiting " + wait + " seconds");
            logger.error(e);
            connection = null;
            closeDBCP(connDetails)
            java.lang.Thread.sleep( wait * 1000 );
        }
    }
    return connection; 
}
///////////////////////////////////////////////////////////////////////
// Wipe out connection pool if/when done using
///////////////////////////////////////////////////////////////////////
function closeDBCP(connDetails)  {
    var pool = globalMap.get(connDetails['mapkey']);
    logger.error("Closing pool" + pool + "before null check.")
    if (pool !== null)  {
        try {
            pool.close();
            pool=null;
            globalMap.remove(connDetails['mapkey']);
            logger.info("DBCP closed to " + connDetails['url']);
        } catch(e)  {
            logger.error("Exception closing DBCP was " + e);
            logger.error("DBCP close failed for " + connDetails['url']);
        }
    }
}
///////////////////////////////////////////////////////////////////////
// Query for stuff
///////////////////////////////////////////////////////////////////////
function queryDB(sql) {
    var channelName = typeof channelId != 'undefined' ? ChannelUtil.getDeployedChannelName(channelId) : 'N/A';
    var connDetails = globalMap.get("OurDB-Connection");
    var dbConn = getDBConn(connDetails);
    if (dbConn === null) {
        logger.error(channelName+" queryDB - dbconn is null disconnected.");
    } else {
        try {
            var statement = dbConn.createStatement();
            var result = statement.executeQuery(sql);
            // Create MirthCachedRowSet, then allow connection to close, so result released for use
            var ourRowSet = new MirthCachedRowSet();
            ourRowSet.populate(result);
            return ourRowSet;
        } catch (ex) {
            logger.error(channelName+" Exception on expression:" + ex);
        }
        finally{
            //this is called regardless, so clean up any potential messes here
            statement.close();
            if(result != null){
                result.close();
            }
            dbConn.close();
        }
    }
    return null;
}
