# Real-time Stock-market prediction
In this repository, I have developed the entire server-side principal architecture for real-time stock market prediction with Machine Learning. I have used Tensorflow.js for constructing ml model architecture, and Kafka for real-time data streaming and pipelining.

## Technologies used:
 1. Kafka.<img align="left" alt="kafka" width="26px" src="./images/kafka2.jpg" />
    - Pipelining logs from source to topics.
    - Topics are subsribed by consumer for real-time ml prediction and model training in parallel.
 2. Tensorflow.js.<img align="left" alt="tf" width="26px" src="./images/tfjslogo.png" />
    - Construction of tensorflow model in node.js.
    - Training model with time-series stock market data.
    - Use tfjs model for real-time prediction.
 3. MongoDB.<img align="left" alt="mongodb" width="26px" src="./images/mongodb.png" />
    - Upadate data-base with incomming stock market logs.
    - Use stored logs for analysis, and model training.
    - Store perormance of the ml model for monitering purpose.
 4. Node.js <img align="left" alt="node" width="26px" src="./images/node.jpg" />
    - The entire server aarchitecture is developed with node.js

