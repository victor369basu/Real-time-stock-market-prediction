/**
 * Description.
 * Consume logs from 2nd topic of the stream pipeline.
 * Tfjs model predict output in real-time.
**/
const kafka = require('kafka-node');
const config = require('./config');
const db = require('./InstantiateDB');
const pre_process = require('./pre_process');
const model = require('./tf_model');

const configKafka = config.kafkaConfig;
const Consumer = kafka.Consumer;
var data_ = [];
let cnt = 0;
var type = config.type;
const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: configKafka.KafkaHost});
let consumer = new Consumer(
	client,
	[{topic: configKafka.KafkaTopic2, partition: 0 }],
    {
    	autoCommit: true,
    	fetchMaxWaitMs: 1000,
    	fetchMaxBytes: 1024 * 1024,
    	encoding: 'utf8',
        // fromOffset: false
    }
	);

consumer.on('message', async function(message){
    console.log(message.value)
    cnt = cnt+1;
    // process data from incomming stream
    if (cnt != 8){
        data_.push(JSON.parse(message.value));
    } else {
        var scaled = pre_process.transform(data_,type);
        const prediction = model.processModel([scaled]);
        // Predict output.
        prediction.then(function(result) {
            
            var predicted_stock_price = pre_process.inverse_transform(result.arraySync());
            console.log("Prediction",type, predicted_stock_price)
        });   
        cnt=0;
        data_ = [];
    }

});
consumer.on('error', function(error) {
    //  handle error 
    console.log('error', error);
});