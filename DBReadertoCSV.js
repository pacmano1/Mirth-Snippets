// Notes: Assumes you have aggregate results set to yes on the DB reader
//        Do not use an outbound template with this solution.
// Code courtesy of Tony Germano and Jon Bartels, original forum thread: https://forums.mirthproject.io/forum/mirth-connect/support/16869-
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

                 _ 
  __ _ _ __   __| |
 / _` | '_ \ / _` |
| (_| | | | | (_| |
 \__,_|_| |_|\__,_|
                   
     _             
    | | ___  _ __  
 _  | |/ _ \| '_ \ 
| |_| | (_) | | | |
 \___/ \___/|_| |_|
                   
*/
     
// Set the root element name to 'delimited' (optional but mentioned)
msg.setName('delimited');

// Loop through each result in the 'msg.result' collection and rename them to 'row'
for each (var result in msg.result) {
    result.setName('row');
}

// Create a header row for the XML data
var headerRow = new XML('<row/>');

// Iterate through each element in the first 'msg.row' (assuming it exists) and create header columns
for each (var element in msg.row[0].children()) {
    if (element != null) {
        var name = element.name();
        var headerColumn = new XML('<' + name + '>' + name + '</' + name + '>');
        headerRow.appendChild(headerColumn);
    }
}

// Prepend the header row to the XML message
msg.prependChild(headerRow);
