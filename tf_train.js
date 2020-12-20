/**
 * Description.
 * Train the tensorflow.js model.
 * Save the trained model.
**/
const config = require('./config');
const db = require('./InstantiateDB');
const pre_process = require('./pre_process');
const model = require('./tf_model');

const configDB = config.dbConfig;
const mlConfig = config.trainConfig;
const timesteps = 7;
const type = config.type;
var i;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * train the tfjs model with 80% data of the database.
 * @return {tfjs} save the trained model in a directory.
**/
async function train(){


	let client = new db.MongoClient(db.uri, { useNewUrlParser: true,  useUnifiedTopology: true });
	    client.connect(err => {
	    if (err) throw err;
	    const collection = client.db(configDB.database).collection(configDB.collectionStream);
	    // Get all data from the database.
	    collection.find({},{ projection: { _id: 0, Date: 1, Open: 1, High: 1, Low: 1, Close:1, Volume:1 } 
	        }).toArray(async function(err, result) {
	            if (err) throw err;
	            var X_train=[];
	            var y_train=[];
                // Using 80% of the total data for training the tfjs model.
	            result = result.slice(0, parseInt((mlConfig.trainSize/100) * result.length));
                // Preprocess data with MinMaxScalar.
	            var train_scaled = pre_process.fit_transform(result,type);
	             for (i=timesteps; i<train_scaled.length; i++){
	                    X_train.push(train_scaled.slice(i-timesteps,i));
	                    y_train.push(train_scaled[i]);
	            }
                // Create the tfjs model.
	            const model_ = model.createModel(X_train);
	            model_.weights.forEach(w => {
					    console.log(w.name, w.shape);
					});
                // Train the model and save it.
	            model.train(model_, X_train, y_train);
	            sleep(2000);

	            client.close();
	        });
	    });
	    
}
train();
module.exports = { train }