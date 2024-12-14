import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

//CONNECTING TO DATABASE
const Mongo_uri = process.env.Mongo_uri.replace(
  'PASSWORD',
  process.env.MONGO_DB_PASSWORD
);

const ConnectDB = () => {
  mongoose
    .connect(Mongo_uri)
    .then(console.log('Database Connection SuccessFul.'));
};

//STARTING SERVER
const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
  ConnectDB();
});

// UNHANDLE REJECTION
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandle rejection : Shutting Down...`);
  server.close(() => {
    process.exit(1);
  });
});

//Unhandle expection
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception : Shutting Down...`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
