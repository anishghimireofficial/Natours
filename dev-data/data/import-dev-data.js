import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import Tour from '../../models/tourModel.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

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

ConnectDB();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import Data into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded.');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Deleting ALl Data From DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully Deleted.');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
