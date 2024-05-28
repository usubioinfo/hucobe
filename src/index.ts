// tslint:disable-next-line
require('tsconfig-paths/register');
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import helmet from 'helmet';

import * as Routes from '@config/route-defs';

dotenv.config();
require('dotenv-defaults/config');

const PORT = process.env.PORT;
const API_BASE = '/';
const db = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
  console.log(`Database Connected: ${db}`);
});

mongoose.connection.on('error', (err: any) => {
  console.log('Database Error: ' + err);
});

// CORS
const accessControl = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://127.0.0.1:4000', 
    'http://localhost:4000', 
    'http://127.0.0.1:4200', 
    'http://bioinfo.usu.edu', 
    'http://localhost:3500', 
    'https://kaabil.net'
  ];
  const origin = req.headers.origin;

  // Use this in the future to abstract yourself away from domain name changes.
  // This would allow you to put the domain in the list above, or maybe even in a config
  // file, and that would make it easier to change domain names.
  if (typeof origin === 'string' && allowedOrigins.indexOf(origin) > -1) {
    console.log(origin);
  }
  

  // The line below is what needs to be changed if you get a CORS error. Just make sure it reflects the URL where the API is being called from.
  res.header('Access-Control-Allow-Origin', 'https://kaabil.net');

  // Check this if you ever need something other than GET and POST (like DELETE or PUT). Just make sure they're in there
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, KBL-User-Agent');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  return next();
}

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(accessControl);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(API_BASE + 'expression', Routes.ExpressionRoutes);
app.use(API_BASE + 'go', Routes.GoRoutes);
app.use(API_BASE + 'results', Routes.ResultRoutes);
app.use(API_BASE + 'kegg', Routes.KeggRoutes);
app.use(API_BASE + 'local', Routes.LocalRoutes);

app.get(API_BASE, (req: Request, res: Response) => {
  res.status(404).send('<h1 style="color: blue; text-align: center;">404 Error</h1>');
});

// Server
app.listen(PORT, () => {
  console.log('\nKBL started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('TLS/HTTPS is off.');
  console.log('Port: ' + PORT);
  console.log(`Reachable at ${API_BASE}`);
});
