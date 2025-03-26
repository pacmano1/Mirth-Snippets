/* Author: Eric Butterfield */

/**
	Executes a SQL statement using a shared database connection stored in the Global Map. If the
	connection does not exist, creates it.

	@param {String} statement - The SQL statement to execute
	@param {Boolean} isQuery - true if the statement is a SELECT, otherwise false
	@param {List} paramList - A Java List object containing the parameters for the statement
		(optional)
	@return {Any} 
*/
function executeSharedDBStatement(statement, isQuery, paramList) {
    var result;
    try {
        var dbConn = globalMap.get("dbConn");
        if (dbConn == null || dbConn.getConnection().isClosed()) {
            dbConn = DatabaseConnectionFactory.createDatabaseConnection(configurationMap.get('DBDriver'), configurationMap.get('DBServerDatabase'), configurationMap.get('DBUserName'), configurationMap.get('DBPassword'));
            globalMap.put("dbConn", dbConn);
        }
        if (paramList == undefined) {
            paramList = new Packages.java.util.ArrayList();
        }
        if (isQuery) {
            result = dbConn.executeCachedQuery(statement, paramList);
        } else {
            result = dbConn.executeUpdate(statement, paramList);
        }
    } catch (e) {
        logger.error(e);
    } finally {
        return result;
    }
}

/* in the mirth Configuration Map:
DBDriver              org.postgresql.Driver
DBServerDtabase       jdbc:postgresql://<hostname>:5432/<dbname>
DBUserName            <the username>
DBPassword            <the password>
*/





