const http = require('http');
const path = require('path');
const app = require('./app');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { mongoConnect } = require('./services/mongo');

const port = process.env.PORT || 8000;
const host = process.env.HOST;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(port, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}

startServer();
