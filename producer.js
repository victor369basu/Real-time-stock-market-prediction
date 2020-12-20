/**
 * Description.
 * Producer - Producer of the Kafka Stream. 
 * Pipeline logs from source to two Topics.
**/
const Kafka = require('kafka-node');
const config = require('./config');
const fs = require('fs');
const parse = require('csv-parse');
var async = require('async');
var path = require('path');

const configKafka = config.kafkaConfig;
const Producer = Kafka.Producer;
const client = new Kafka.KafkaClient({kafkaHost: configKafka.KafkaHost});
var producer = new Producer(client, {requireAcks: 1, partitionerType: 2});
var KeyedMessage = Kafka.KeyedMessage;
var km = new KeyedMessage('key', 'message');

const parentDir = './Datasets/';
const averageDelay = 3000;  // in miliseconds
const spreadInDelay = 2000; // in miliseconds
var ProducerReady = false ;
var stockArray;

producer.on('ready', async function () {
    console.log("Producer is ready");
    ProducerReady = true;
});

producer.on('error', function (err) {
  console.error("Problem with producing Kafka message "+err);
})
 
var parser = parse({delimiter: ','}, function (err, data){
    stockArray = data;
    handleStock(1);  
});
// Read data from a data-source.
fs.createReadStream(parentDir.concat('HPQ.csv')).pipe(parser); 
/**
 * Read data from a file and sent it for streaming.
 * @param {integer} dataCount - maintains the row count.
**/
function handleStock(dataCount){
	var line = stockArray[dataCount];
	var stock = { "Date":line[0]
		        , "Open":parseFloat(line[1])
		        , "High":parseFloat(line[2])
		        , "Low":parseFloat(line[3])
		        , "Close":parseFloat(line[4])
		        , "Volume":parseFloat(line[6])
		};
	stockMarketMessages(stock)
	// Adds delay after passing each log to the pipeline.
	var delay = averageDelay + (Math.random() -0.5) * spreadInDelay;
	setTimeout(handleStock.bind(null,dataCount+1), delay);

}
/**
 * Pipeline processed logs into 2 topics.
 *  @param {JSON} data - processed logs.
**/
function stockMarketMessages(data){
	KeyedMessage = Kafka.KeyedMessage;
	KM = new KeyedMessage(data.code, JSON.stringify(data));
    // Pipeline logs into two topics.
	payloadToKafkaTopic = [
        { topic: configKafka.KafkaTopic1, partition: 0, messages: KM },
        { topic: configKafka.KafkaTopic2, partition: 0, messages: KM },
    ];
    if(ProducerReady){
	    producer.send(payloadToKafkaTopic, function (err, data) {
	        console.log(data);
	    });
    } else {
    	console.error("sorry, Producer is not ready yet, failed to produce message to Kafka.");
    }
    
}