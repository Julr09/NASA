const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadLaunchesData } = require('./models/launches.model');

const port = process.env.PORT || 8000;
const host = process.env.HOST;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadLaunchesData();
  server.listen(port, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}

startServer();
