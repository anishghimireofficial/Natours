import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

//CONNECTING TO DATABASE
const Mongo_uri = process.env.Mongo_uri.replace(
  'PASSWORD',
  process.env.MONGO_DB_PASSWORD
);

const ConnectDB = async () => {
  try {
    await mongoose.connect(Mongo_uri);
    console.log('Database Connection SuccessFul.');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

//STARTING SERVER
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
  ConnectDB();
});
