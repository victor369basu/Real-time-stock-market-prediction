const kafka = require('kafka-node');
const config = require('./config');
const client = new kafka.KafkaClient({kafkaHost: config.KafkaHost});

const topicToCreate = [{
	topic: config.KafkaTopic1,
	partitions: 1,
	replicationFactor: 3,
},
{
	topic: config.KafkaTopic2,
	partitions: 1,
	replicationFactor: 3,
}
]
client.createTopics(topicToCreate, (error, result) => {
	// result is an array of any errors if a given topic could not be created
	console.log(result, 'topic created successfully');
})