/**
 * @file routeMessageFunctions.js
 * @author Tony Germano
 * @description
 * This file contains utility functions for routing messages in Mirth Connect.
 * It simplifies routing by automatically creating `RawMessage` objects and 
 * including necessary metadata, replicating the behavior of Channel Writer destinations.
 *
 * # Route with Sources
 * 
 * Mirth provides two ways to send messages from one channel to another. The simple way is by using a
 * Channel Writer destination. This lets you choose your destination channel, set optional "Message
 * Metadata," which will appear in the sourceMap of the new message, and create a template for the
 * message.
 *
 * The second method is by using the `VMRouter` class from the User API. Mirth automatically inserts
 * an instance of this class into the top-level JavaScript scope named `router`. You can send metadata
 * with your messages using this method as well, but it is slightly more complicated as it requires
 * constructing a `RawMessage` to pass to the route command.
 *
 * Additionally, when you use a Channel Writer, it automatically inserts metadata into the sourceMap
 * representing the current channel and message, as well as any prior channels and messages that may
 * have participated in the message chain. This functionality does not exist when using the `router`
 * object to send messages.
 *
 * This library aims to make sending messages from JavaScript as easy as using a Channel Writer, while
 * also incorporating the same channel and message tracking capabilities.
 *
 * This is accomplished through three related functions. See the source of each function for full
 * usage:
 *
 * - **createRawMessage:** This creates an instance of `RawMessage` as specified in the Mirth User API. 
 *   Additionally, it mimics the behavior of a Channel Writer destination and appends metadata to the 
 *   sourceMap of the `RawMessage` by incorporating the `channelId` and `messageId` from the current 
 *   JavaScript context, if present.
 *
 * - **routeMessage:** Wrapper for `router.routeMessage`, which calls `createRawMessage` from this library 
 *   before sending the message. There are optional parameters to pass a sourceMap as the seed for the one 
 *   created by `createRawMessage` and for the `destinationSet` to be used by `createRawMessage`.
 *
 * - **routeMessageByChannelId:** This is the same as the `routeMessage` function from this library except it 
 *   wraps `router.routeMessageByChannelId`.
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
