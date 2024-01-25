// Note: This code was provided by "carles" from Mirth Forums.
// Importing necessary packages from ActiveMQ and JMS for messaging services.
importPackage(org.apache.activemq);
importPackage(javax.jms);

// Initializing an empty string to store the received text message.
var text = "";

// Establishing a connection factory for ActiveMQ with username, password, and connection URL.
// The failover transport is used to automatically reconnect in case of a connection failure.
var connectionFactory = new ActiveMQConnectionFactory("user", "password", "failover:(tcp://localhost:61616)?maxReconnectAttempts=0");

// Creating a connection using the connection factory.
var connection = connectionFactory.createConnection();
// Setting a unique client ID for the connection.
connection.setClientID("client-test");
// Starting the connection to enable message receiving.
connection.start();

// Creating a session from the connection without transactions and with auto-acknowledge.
var session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
// Creating a topic destination named "Test-topic" for receiving messages.
var destination = session.createTopic("Test-topic");

// Creating a message consumer for the specified destination.
var consumer = session.createConsumer(destination);

// Receiving a message from the destination with a timeout of 10000 milliseconds.
var message = consumer.receive(10000);

// Checking if the received message is a text message.
if (message instanceof TextMessage) {
    // Retrieving the text from the message.
    text = message.getText();
}

// Closing the consumer, session, and connection to release resources.
consumer.close();
session.close();
connection.close();

// Returning the text message if it is not empty.
if (text !== "") {
    return text;
}


