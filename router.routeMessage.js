/**
 * @file routeMessageFunctions.js
 * @author Tony Germano
 * @description
 * This file contains utility functions for routing messages in Mirth Connect.
 * These functions simplify the process of routing messages by abstracting away 
 * the details of creating raw messages and routing them to the appropriate channel.
 */

/**
 * Routes a message to a specified channel by name.
 *
 * @param {string} channelName - The name of the channel to which the message should be routed.
 * @param {Object} message - The message to be routed.
 * @param {Object} sourceMap - The source map containing metadata or properties related to the message.
 * @param {Object} destinationSet - The destination set specifying where the message should be routed.
 * @returns {Object} - The result of the routing process.
 *
 * @example
 * const result = routeMessage('MyChannel', message, sourceMap, destinationSet);
 */
function routeMessage(channelName, message, sourceMap, destinationSet) {
    return router.routeMessage(channelName, createRawMessage(message, sourceMap, destinationSet));
}

/**
 * Routes a message to a specified channel by ID.
 *
 * @param {string} channelId - The ID of the channel to which the message should be routed.
 * @param {Object} message - The message to be routed.
 * @param {Object} sourceMap - The source map containing metadata or properties related to the message.
 * @param {Object} destinationSet - The destination set specifying where the message should be routed.
 * @returns {Object} - The result of the routing process.
 *
 * @example
 * const result = routeMessageByChannelId('1234abcd', message, sourceMap, destinationSet);
 */
function routeMessageByChannelId(channelId, message, sourceMap, destinationSet) {
    return router.routeMessageByChannelId(channelId, createRawMessage(message, sourceMap, destinationSet));
}
