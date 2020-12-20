/**
 * Description.
 * Connect to MongoDB Client.
 * Do basic CRUD operations with MongoDB.
**/
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;

const configDB = config.dbConfig;
// Database configuration.
const uri = "mongodb+srv://"
            + configDB.user + ":"
            + configDB.password + "@"
            + configDB.server
            + configDB.database
            + "?retryWrites=true&w=majority";
/**
 * Update MongoDB with incomming logs.
 * @param {JSON} message - Incomming messages to be updated to DB.
 * @param {String} collectionInterface - Connect to specific collection of the DB.
 * @param {Boolean} stream - If incomming messages are from a kafka stream or not.
**/
async function updateMongoDB(message, collectionInterface = configDB.collectionStream, stream=true){
    
    if (stream == true){
        console.log(
            'kafka ',
            JSON.parse(message.value)
        );
        var logs_ = JSON.parse(message.value)
    } else {
        console.log(
            'Ml_Prediction ',
            message
        );
        logs_ = message
    }
    let client = await MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
    client.connect(err => {
    if (err) throw err;
    const collection = client.db(configDB.database).collection(collectionInterface);
    collection.insertOne(logs_, function(err, res) {
        if (err) throw err;
        console.log("documents inserted." + res.insertedCount);
    });
    });
    client.close();
}
/**
 * Get information about the Database collection.
 * @return {integer} size of the database collection.
 * @return {JSON} return first three logs of the database collection.
**/
async function getDBInfo(){
    
    let client = await MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
    client.connect(err => {
    if (err) throw err;
    const collection = client.db(configDB.database).collection(configDB.collectionStream);
    collection.find({},{ projection: { _id: 0, Date: 1, Open: 1, High: 1, Low: 1, Close:1, Volume:1 } 
        }).toArray(function(err, result) {
            if (err) throw err;
            console.log("Size of DB: "+result.length);
            console.log("First three objects of the Array: ");
            console.log(result.slice(0,3));
    client.close();
        });
    });
}

module.exports = { updateMongoDB, MongoClient, uri, getDBInfo}
