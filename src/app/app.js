const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('dev'));
app.use(express.json());

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

module.exports = app;