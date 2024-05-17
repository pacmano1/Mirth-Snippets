/**
 * ResultSetUtil
 * A utility for working with result sets from a database.
 * 
 * Courtesy of @agermano, certified genius that sometimes forgets why he wrote stuff. From Mirth Slack
 */
/*
 _____ _                 _        
|_   _| |__   __ _ _ __ | | _____ 
  | | | '_ \ / _` | '_ \| |/ / __|
  | | | | | | (_| | | | |   <\__ \
  |_| |_| |_|\__,_|_| |_|_|\_\___/

 _____                 
|_   _|__  _ __  _   _ 
  | |/ _ \| '_ \| | | |
  | | (_) | | | | |_| |
  |_|\___/|_| |_|\__, |
                 |___/
*/
var ResultSetUtil = {
    /**
     * getRowLabels
     * Retrieves the column labels from a result set's metadata.
     * 
     * @param {ResultSet} resultSet - The result set to extract labels from.
     * @returns {string[]} An array of column labels.
     */
    getRowLabels: function getRowLabels(resultSet) {
        var labels = [];
        var meta = resultSet.metaData;
        for (var i = 0; i < meta.columnCount; i++) {
            labels.push(meta.getColumnLabel(i + 1));
        }
        return labels;
    },

    /**
     * getRowAsJs
     * Converts a row from a result set into a JavaScript object.
     * 
     * @param {ResultSet} resultSet - The result set containing the row data.
     * @param {string[]} labels - An array of column labels.
     * @returns {Object} A JavaScript object representing the row data.
     */
    getRowAsJs: function getRowAsJs(resultSet, labels) {
        return labels.reduce(function (obj, label, i) {
            if (resultSet.getObject(i + 1) != null) {
                obj[label] = resultSet.getObject(i + 1).toString();
            } else {
                obj[label] = null;
            }
            return obj;
        }, {});
    },

    /**
     * getRowAsXml
     * Converts a row from a result set into an XML element.
     * 
     * @param {ResultSet} resultSet - The result set containing the row data.
     * @param {string[]} labels - An array of column labels.
     * @returns {XML} An XML element representing the row data.
     */
    getRowAsXml: function getRowAsXml(resultSet, labels) {
        return labels.reduce(function (obj, label, i) {
            obj.appendChild(<{ label }>{resultSet.getObject(i + 1)}</{ label }>);
            return obj;
        }, <row />);
    }
}

// Export the ResultSetUtil for usage in other modules if needed.
module.exports = ResultSetUtil;
