const mongoose = require('mongoose');
const config = require('config');
const CONST_CONNECTION_STRING = config.get('mongoURI');

const CONST_CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}; // CONST_CONNECTION_OPTIONS

const connectDB = async () => {
    try {
        await mongoose.connect(CONST_CONNECTION_STRING, CONST_CONNECTION_OPTIONS);
        console.log('MoongoDB connected');
    } // try
    catch(err) {
        console.error(err);
        // Exit process with failure
        process.exit(1);
    } // catch
}

module.exports = connectDB;