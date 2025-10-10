
# Open Integration Engine Snippets

This repository contains various code snippets and utilities for working with Mirth Connect, AWS, databases, JWT, and other integration-related tasks.

## Repository Structure

The repository is organized by different use cases. Below is a summary of the main scripts and documentation included in this repository.

### Open Integratipn Engine Related Scripts
- **AWS_getSecret.js**: Retrieves secrets from AWS Secrets Manager for use within Mirth Connect.
- **ActiveMQ_JMS_Listener.js**: Script to listen for messages on ActiveMQ using JMS.
- **ActiveMQ_JMS_Sender.js**: Script to send messages to ActiveMQ using JMS.
- **MirthSSH_4.5.md**: Documentation on using SSH with Mirth Connect.
- **HL7 add FHIR.xml**: Example of adding FHIR to an HL7 message.
- **mirth_and_MSSQL_withTLS.md**: Guide for connecting Mirth Connect to MSSQL with TLS.
- **mirth_backup.md**: Mirth backup strategy and instructions.
- **mirth_bash_backup.sh**: A bash script for automating Mirth backups.

### Database and Data Processing Utilities
- **DBCP2.js**: Database connection pooling using DBCP2.
- **DBReadertoCSV.js**: Converts database reader output to CSV format.
- **ResultSetUtil.js**: Utility functions to manipulate `ResultSet` data.
- **executeSharedDBStatement.js**: Executes shared database statements across multiple sources.

### JWT (JSON Web Tokens)
- **JWTviaJS.js**: Generates JWT tokens using JavaScript.  VERY SLOW
- **JWTviaJose4jlib.js**: Generates JWT tokens using the Jose4j Java library. 
- **epicJWTforBackend_uses_jsrassign.js**: Generates JWT for backend systems using jsrassign.
- **epicJWTusingNimbusJava.js**: Generates JWT using the Nimbus Java JWT library.   I USE THIS ONE

### File Manipulation Utilities
- **PDFtoTIFF.js**: Converts PDF files to TIFF format.
- **combineBase64PDFs.js**: Combines multiple Base64-encoded PDFs into one file.
- **create_dir.js**: Creates directories dynamically within scripts.
- **create_zip_with_wildcards.js**: Zips files based on wildcard patterns.
- **movefile.js**: Moves files between directories.

### SFTP and SSH Utilities
- **sftp_get_to_attachment_newJsch.js**: Retrieves files via SFTP using the JSch library.
- **sftpviaSSHJ.js**: Handles SFTP transfers using the SSHJ library.
- **loginMirthConnectAPI.js**: Automates login to the Mirth Connect API using SSH.

### Miscellaneous Utilities
- **bluebutton_simple_api.js**: Example of a simple Blue Button API.
- **createDebugMap.js**: Creates a debug map for tracking processing information.
- **createListofAttachments.js**: Generates a list of attachments from a source.
- **dynamic_source_file_reader_name.js**: Dynamically sets source file names during processing.
- **groupAndSum.js**: Groups and sums data based on specified criteria.
- **replaceNullsWithEmptyStrings.js**: Replaces null values with empty strings in data structures.
- **router.routeMessage.js** 
- **select_named_headers_from_sourceMap.js**: Selects named headers from a source map.
- **sum_and_group_v2.js**: Advanced grouping and summing of data.

### Documentation and SQL Queries
- **HAPI_FHIR_example.md**: Documentation on integrating HAPI FHIR with Mirth Connect.
- **message_response_time.sql**: SQL query to analyze message response times.
- **mssql_jdbc_connect_strings.txt**: MSSQL JDBC connection strings.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributions
Feel free to submit issues or pull requests if you have improvements or find bugs in the scripts.
