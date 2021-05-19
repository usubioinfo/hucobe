require('tsconfig-paths/register');
import { translateGenes } from './keggparse/parse';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
require('dotenv-defaults/config');

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

(async () => {
  await translateGenes();
})();
