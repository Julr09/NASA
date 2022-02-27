const planets = require('./planets.mongo');

function getAllPlanets() {
  return planets.find({}, { _id: 0, __v: 0 });
}

module.exports = {
  getAllPlanets,
};
