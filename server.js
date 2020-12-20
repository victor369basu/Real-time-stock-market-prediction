const ml = require('./tf_train');
const ml_val = require('./tf_validate')
const http = require('http');
const socketio = require('socket.io');

const TIMEOUT_BETWEEN_EPOCHS_MS = 500;
const PORT = 8001;

// util function to sleep for a given ms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to start server, perform model training, and emit stats via the socket connection
async function run() {

	const port = process.env.PORT || PORT;
	const server = http.createServer();
	const io = socketio(server);

	server.listen(port, () => {
	    console.log(`  > Running socket on port: ${port}`);
	  });
    io.on('connection', (socket) => {
    	socket.on('Train', async () => {
    		io.emit('Model Performance', await ml.train());
	    });

	    socket.on('Validate', async () => {
    		io.emit('Model Performance', await ml_val.val());
	    });

	 });

    ml.train();
    io.emit('trainingComplete', true);
	
}
run();