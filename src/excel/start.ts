require('tsconfig-paths/register');
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { parseDict, argDict } from './dictionary';

dotenv.config();
require('dotenv-defaults/config');

if (process.argv.length < 3) {
  console.log('Need an argument!');
  process.exit(1);
}

const arg = process.argv[2];

const FILE = argDict[arg];
console.log(`Using ${FILE}`);

const db = `mongodb://localhost:27017/${process.env.DB_NAME}`;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
  console.log(`Database Connected: ${db}`);
});

mongoose.connection.on('error', (err: any) => {
  console.log('Database Error: ' + err);
});

const dataPath = path.resolve('hdata');

const readAllExcel = async () => {
  for (let i = 0; i < 7; i++) {
    await parseDict[FILE](`${dataPath}/${FILE}`, i);
  }
}

(async () => {
  await readAllExcel();
  console.log('All finished!');
  process.exit(0);
})();
