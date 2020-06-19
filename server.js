const express = require('express');

const app = express();

app.get('/', (req, res) => res.json({ msg: 'Welcome to the server!' }));

//Define app routes wtih app.use
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/contacts', require('./routes/contacts'));

const PORT = process.env.port || 5000;

//Initalize express serrver
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
