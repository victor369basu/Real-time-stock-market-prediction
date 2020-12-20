const config = {

	"kafkaConfig":{
		KafkaHost:'localhost:9092',
	    KafkaTopic1: 'StockMarketAnalysis',
	    KafkaTopic2: 'StockMarketPredictions',
	},
    "dbConfig":{
    	user: 'VictorBasu',
	    password: 'V1cTOR',
	    server: 'clustera1.cvglu.mongodb.net/',
	    database: 'StockLogsDB',
	    collectionStream: 'StockData',
	    collectionML: 'mlPrediction',
    },
    "trainConfig":{
    	trainSize: 85,
    	epoch: 50,
    	batchSize: 32,
        modelDir: 'models',
    },
    "type": "Open"
};

module.exports = config;