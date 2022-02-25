const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const { loadPlanetsData } = require('./models/planets.model');

const port = process.env.PORT || 8000;
const host = process.env.HOST;
const uri = process.env.MONGO_URI;
const server = http.createServer(app);

mongoose.connection.on('open', () => {
  console.log('Database Connected');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(uri);
  await loadPlanetsData();
  server.listen(port, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}

startServer()
  .then(() => console.log('Server awaits for data before running'));
