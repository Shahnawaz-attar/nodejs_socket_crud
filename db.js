const mongooose = require('mongoose');
const Schema = mongooose.Schema;
const db = mongooose.createConnection('mongodb://localhost/nodejs_socket');


//check if the connection is successful
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
}
);

module.exports = db;

