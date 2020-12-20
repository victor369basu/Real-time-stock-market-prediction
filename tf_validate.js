/**
 * Description.
 * Validate the tensorflow.js model performance.
 * Update the database with model performance.
**/
const config = require('./config');
const db = require('./InstantiateDB');
const pre_process = require('./pre_process');
const model = require('./tf_model');
const train = config.trainConfig;
const configDB = config.dbConfig;
const timesteps = 7;
const type = config.type;
/**
 * Validate the ml model perfromance with 20% data of the database.
 * Update database with model performance.
**/
async function val(){

    let client = new db.MongoClient(db.uri, { useNewUrlParser: true,  useUnifiedTopology: true });
        client.connect(err => {
        if (err) throw err;
        const collection = client.db(configDB.database).collection(configDB.collectionStream);
        collection.find({},{ projection: { _id: 0, Date: 1, Open: 1, High: 1, Low: 1, Close:1, Volume:1 } 
            }).toArray(async function(err, result) {
            	var X_test=[];
                
                // Using 20% of the total data for training the tfjs model. 
            	var test_data = result.slice(parseInt((train.trainSize/100) * result.length), result.length);
                var test_data_inp = result.slice(result.length - test_data.length - timesteps, 
                    result.length);
                // Preprocess data with MinMaxScalar.
                var test_scaled = pre_process.transform(test_data_inp,type);
                for (i=timesteps; i<test_data.length + timesteps; i++){
                        X_test.push(test_scaled.slice(i-timesteps,i));
                }
                // Get model prediction.
                const prediction = model.processModel(X_test);
                prediction.then(function(result) {
    		       // Inverse scale the predicted values to original value.
    			   var predicted_stock_price = pre_process.inverse_transform(result.arraySync());
                   
                   for(var i=0; i<test_data.length; i++){
                    data_ = {"date": test_data[i].Date, 
                             "Prediction": predicted_stock_price[i],
                             "real":  test_data[i][type],
                             "type": type
                         }
                    // Update database with model performance.
                    db.updateMongoDB(data_, configDB.collectionML, false)
                }
                   
    			})
            	client.close();
                

            });
        
        });

}
val();