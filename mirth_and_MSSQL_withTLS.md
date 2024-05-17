
# Creating a Self-Signed Certificate for Microsoft SQL Server

This guide will help you create a self-signed certificate using OpenSSL, which can be used in Microsoft SQL Server. 

The certificate will include the proper key usage and extended key usage properties required for server authentication.

For mirth.properties:
```text
database = sqlserver
database.url = jdbc:jtds:sqlserver://yourseriver:1433/mirthdb;encrypt=true;trustServerCertificate=true
database.username = someuser
database.password = somepassword
```

For a database reader:
```text
jdbc:sqlserver://yourserver:1433;databaseName=junk;encrypt=true;trustServerCertificate=true
```

## Steps

### 1. Generate a Private Key

First, generate a private key using the following command:

```sh
openssl genpkey -algorithm RSA -out mssql.key -pkeyopt rsa_keygen_bits:2048
```

### 2. Create an OpenSSL Configuration File

Create a file named `openssl.cnf` and include the following content. Replace `YourServerName` with the hostname of your SQL Server.

```ini
[ req ]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[ req_distinguished_name ]
CN = YourServerName

[ v3_req ]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
```

### 3. Generate a Certificate Signing Request (CSR)

Generate a CSR using the private key and the configuration file:

```sh
openssl req -new -key mssql.key -out mssql.csr -config openssl.cnf
```

### 4. Generate a Self-Signed Certificate

Generate a self-signed certificate with the correct key usage:

```sh
openssl x509 -req -days 365 -in mssql.csr -signkey mssql.key -out mssql.crt -extensions v3_req -extfile openssl.cnf
```

### 5. Convert the Certificate and Key to PKCS#12 Format

Convert the certificate and key to a PKCS#12 file, which can be imported into the Windows certificate store:

```sh
openssl pkcs12 -export -out mssql.pfx -inkey mssql.key -in mssql.crt
```

### 6. Import the Certificate into Microsoft SQL Server

After creating the `.pfx` file, you need to import it into the Windows certificate store and configure SQL Server to use it.

#### Import the Certificate:

1. Open the Microsoft Management Console (MMC) and add the Certificates snap-in for the Local Computer.
2. Import the `.pfx` file into the Personal store.

#### Configure SQL Server to Use the Certificate:

1. Open SQL Server Configuration Manager.
2. Go to **SQL Server Network Configuration** > **Protocols for [YourInstance]**.
3. Right-click on the "Protocols for [YourInstance]" and select "Properties".
4. Go to the "Certificate" tab and select the certificate you imported.
5. Go to the "Flags" tab and set "Force Encryption" to "Yes".

### 7. Restart SQL Server

Restart the SQL Server service to apply the changes.
