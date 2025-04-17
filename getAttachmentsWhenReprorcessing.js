// Courtesy of Nick Rupley from Mirth Slack - gets attachments when re-processing messages.
/* From Tony Germano
When reprocessing, whether you need this script or not depends on if you check the override existing message box or not (similar to when you double-click to create a new message)
if it's a new message id, then you need the script because the attachment is still on the old message id
*/
// Workaround until this is done better in Mirth Connect
function getOriginalAttachments(base64Decode) {
	if ($('reprocessed') == true) {
		var filter = com.mirth.connect.model.filters.MessageFilter();
		filter.setMinMessageId(connectorMessage.getMessageId());
		filter.setMaxMessageId(connectorMessage.getMessageId());
		var messages = com.mirth.connect.server.controllers.ControllerFactory.getFactory().createMessageController().getMessages(filter, channelId, false, 0, 1);
		if (messages.size() > 0) {
			var originalId = messages.get(0).getOriginalId();
			if (originalId) {
				return AttachmentUtil.getMessageAttachments(channelId, originalId, base64Decode || false);
			}
		}
	}

	// Empty list
	return Lists.list();
}
