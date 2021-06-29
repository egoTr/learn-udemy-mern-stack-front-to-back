const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init middlewares
app.use( express.json({ extended: false }) );       // let express recognizes the incoming Request Object as a **JSON Object**
app.use( express.urlencoded({ extended: true }) );  // let express recognizes the incoming Request Object as **strings or arrays**

app.get('/', (req, res) => {
    res.send('API running');
})

// Define routes
app.use( '/api/users', require('./routes/api/users') );
app.use( '/api/profile', require('./routes/api/profile') );
app.use( '/api/posts', require('./routes/api/posts') );
app.use( '/api/auth', require('./routes/api/auth') );
app.use( (req, res) => { // 404 error
    res.status(404).send('Not found');
})

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
})