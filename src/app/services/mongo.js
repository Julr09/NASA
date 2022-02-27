const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

mongoose.connection.on('open', () => {
  console.log('Database Connected');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(`${process.env.MONGO_URI}`);
}

async function mongoDisConnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisConnect,
};
