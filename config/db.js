const mongoose = require('mongoose');
const config = require('config');
//getting the mongo uri from the default.json file with the config moudle
const db = config.get('mongoURI');

//connect to mongo db
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected ${conn.connection.host}`.rainbow);
  } catch (error) {
    console.error(`Problem with db ${error.message}.red`);
    process.exit(1);
  }
};

module.exports = connectDB;
