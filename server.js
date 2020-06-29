const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors');
const morgan = require('morgan');
const config = require('config');
const app = express();

//Connect database
connectDB();

//Init middleware to be able to accpet data from the req.body
app.use(express.json({ extended: false }));

if (config.get('nodeENV') === 'development') {
  app.use(morgan('dev'));
}
//Define app routes wtih app.use
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/contacts', require('./routes/contacts'));

const PORT = process.env.port || 5000;

//Initalize express serrver
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`.yellow);
});
