#!/bin/bash

# Set these three vars as needed

backupPath="/home/backups/"
mccommand_to_run="/usr/local/bin/mccommand"
mccommand_config_properties="/usr/local/mirthconnect/conf/mirth-cli-config.properties"   # you must edit the credentials in this file.

# Rest of script no changes needed

# the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# the temp directory used, within $DIR
workdir=`mktemp -d -p "$DIR"`      # created in current diretory
# check if tmp dir was created
if [[ ! "$workdir" ]]; then
	echo "Could not create temp dir"
	exit 1
fi
# deletes the temp directory - only if tmp dir was created
function cleanup {
	rm -rf "$workdir"
}
# register the cleanup function to be called on the EXIT signal
trap cleanup EXIT

# settings the paths
vDate=`date --date 'yesterday' +%Y-%m-%d`

# generating console command
echo exportcfg ${backupPath}mirth_backup-${vDate}.xml > ${workdir}/backup_cmds
# cat ${workdir}/backup_cmds

if [ ! -d ${backupPath} ]; then
	echo "Backup Directory Not Found: ${backupPath}"
else
	if [ -w ${backupPath} ] ; then 
		echo "Starting Backup"
		${mccommand_to_run} -c ${mccommand_config_properties} -s ${workdir}/backup_cmds
	else
		echo "Cannot Write to Backup Directory: ${backupPath}"
	fi
fi

if [ ! -f ${backupPath}mirth_backup-${vDate}.xml ]; then
	echo "BACKUP FAILED"
else
	echo "gzipping backup"
	gzip -f ${backupPath}mirth_backup-${vDate}.xml
	echo "BACKUP COMPLETED"
fi
