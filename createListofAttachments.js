// For either of these you need to then store the var in $co or $c and use the name of that variable in the SMTP sender.  Use only the variable name,
// it should not have ${ } at all.   

// Smarter Code courtesy of Tony Germano (agermano) from Mirth Slack / Forums.

var attachmentsList = getAttachments().toArray()
    .map((attachment,i) =>
        new AttachmentEntry('file_prefix_' + i + '.pdf', attachment.getContentString(), attachment.getType())
         

         
// Dumber code:

var attachment_list = getAttachmentIds()
var attachmentsList = Lists.list()
for (var i = 0; i < attachment_list.length; i++) {
	var attachment_entry = new AttachmentEntry();
	var attachmentId = attachment_list.get(i)
	var attachment = getAttachment(attachmentId, false)
	attachment_entry.setMimeType(attachment.getType());
	attachment_entry.setContent(attachment.getContentString()) 
	attachment_entry.setName('Some Name: ' + i + '.pdf');
	attachmentsList.add(attachment_entry);
}
