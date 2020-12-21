# Server architecture for Real-time Stock-market prediction with ML
<img align="center" alt="architecture" src="./images/Architecture2.png" />
In this repository, I have developed the entire server-side principal architecture for real-time stock market prediction with Machine Learning. I have used TensorFlow.js for constructing ml model architecture, and Kafka for real-time data streaming and pipelining.

## Technologies used:
 1. Kafka.<img align="left" alt="kafka" width="26px" src="./images/kafka2.jpg" /><br>
    - Pipelining logs from source to topics.
    - Topics are subscribed by consumer for real-time ml prediction and model training in parallel.
 2. TensorFlow.js.<img align="left" alt="tf" width="26px" src="./images/tfjslogo.png" /><br>
    - Construction of tensorflow model in node.js.
    - Training model with time-series stock market data.
    - Use tfjs model for real-time prediction.
 3. MongoDB.<img align="left" alt="mongodb" width="26px" src="./images/mongodb.png" /><br>
    - Update data-base with incoming stock market logs.
    - Use stored logs for analysis, and model training.
    - Store performance of the ml model for monitoring purpose.
 4. Node.js <img align="left" alt="node" width="26px" src="./images/node.png" /><br>
    - The entire server architecture is developed with node.js

## Implementation

### Start the Kafka environment
Start the ZooKeeper service.
```sh
$ bin/zookeeper-server-start.sh config/zookeeper.properties
```
Start the Kafka broker service
```sh
$ bin/kafka-server-start.sh config/server.properties
```

### Start Streaming of logs.

Here, I have used .csv files in the dataset folder as the source of data. The data-source is pipelined with Kafka Topics. The first topic pipelines logs to MongoDB and the second topic pipelines logs to Tensorflow model for real-time prediction.<br>
The streaming of logs from data-source through producer and consumer makes this architecture suitable for real-time analysis, ML model training and model prediction in parallel.<br>
The producer could be started from
```sh
$ node producer.js
# or
$ start.sh
```
Streaming producer logs.<br>
<img align="center" alt="producer" src="./images/producer.png" />
<br>
```sh
$ node consumer.js
```
Streaming consumer logs.<br>
<img align="center" alt="consumer" src="./images/consumer.png" />
<br>
In the __consumer__(consumer.js) the incoming logs are updated to MongoDB for further model training and analysis.

### Machine Learning model.

The machine learning model architecture has been developed with TensorFlow.js. The model is trained with 80% of the stored data and validated against 20% of them. As the problem statement focuses over a time-series problem so we need to pre-process the data before training. Data have been pre-processed with **MinMax-Scalar** algorithm.<br>
Training the ml model.
```sh
$ node tf_train.js
# or
$ server.sh
```
<img align="center" alt="train" src="./images/train.png" />
Validating the model.

```sh
$ node tf_validate.js
```

<img align="center" alt="train" src="./images/validate.png" /><br>
After validation the real and predicted values along with date and attribute of the stock-market time-series data that the model is trained against are updated to the MongoDB.<br>
### Model performance chart from MongoDB
<img align="center" alt="performance" src="./images/MLCharts.png" />

### Real-time prediction.
The weights of the trained model are saved and loaded at the consumer side that subscribes to the second topic of the Kafka stream and predicts the output of the time-series event in real-time. As both topics of the Kafka pipeline are working in parallel, parallelism is achieved and logs are streamed by Kafka is real-time, which indeed implies the machine learning model could train and predict target in real-time.
```sh
$ node ml_consumer.js
```
<img align="center" alt="ml_consumer" src="./images/ml_consumer.png" />

```
Prediction [attribute] [predicted value].
example - Prediction Open 0.12453 
```
This line in the above image(ml_consumer.js output) indicates the prediction of the model in real-time. The model utilizes 7 prior time-series logs as input and predicts the 8th time-series event. 


## Future Scopes.

1. I have created the server-side architecture of the model, for which the client-side also needed to be developed.
2. I was researching on react.js for construction of the client-side, but I failed at some aspects due to which I left the client-side for future development.
3. The code I have written could be further optimised for better architectural design and model performance.