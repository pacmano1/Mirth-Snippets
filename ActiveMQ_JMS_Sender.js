// Importing necessary packages from ActiveMQ and JMS for messaging services.
importPackage(org.apache.activemq);
importPackage(javax.jms);

// Code authored by "carles" from Mirth Forums

// Establishing a connection factory for ActiveMQ with username, password, and connection URL.
// The failover transport is used to automatically reconnect in case of a connection failure.
var connectionFactory = new ActiveMQConnectionFactory("admin","admin","failover:(tcp://localhost:61616)?maxReconnectAttempts=0");

// Creating a connection using the connection factory.
var connection = connectionFactory.createConnection();
// Setting a unique client ID for the connection.
connection.setClientID("producer-test");
// Starting the connection to enable message sending.
connection.start();

// Creating a session from the connection without transactions and with auto-acknowledge.
var session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
// Creating a topic destination named "Test-topic" for sending messages.
var destination = session.createTopic("Test-topic");

// Creating a message producer for the specified destination.
var producer = session.createProducer(destination);
// Setting the delivery mode of messages to non-persistent.
// Non-persistent delivery mode does not store messages to disk and is faster.
producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);

// Defining the text message to be sent.
var text = "Hello world!";
// Creating a text message with the defined text.
var message = session.createTextMessage(text);
// Sending the message to the destination.
producer.send(message);

// Closing the producer, session, and connection to release resources.
producer.close();
session.close();
connection.close();

// Code authored by "carles from Mirth Forums"
