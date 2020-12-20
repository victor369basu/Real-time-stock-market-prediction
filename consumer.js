/**
 * Description.
 * Consumer - consumer of the Kafka Stream.
 * Consume messages from the stream and update them to MongoDB.
**/
const kafka = require('kafka-node');
const config = require('./config');
const db = require('./InstantiateDB');

const configKafka = config.kafkaConfig;
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: configKafka.KafkaHost});
let consumer = new Consumer(
	client,
	[{topic: configKafka.KafkaTopic1, partition: 0 }],
    {
    	autoCommit: true,
    	fetchMaxWaitMs: 1000,
    	fetchMaxBytes: 1024 * 1024,
    	encoding: 'utf8',
        // fromOffset: false
    }
	);
consumer.on('message', async function(message){
    // Storing or updating consumed stream messages to MongoDB.
	db.updateMongoDB(message)
});
consumer.on('error', function(error) {
    //  handle error 
    console.log('error', error);
});