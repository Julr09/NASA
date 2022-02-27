const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');

async function saveLaunches(launch) {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });
  if (!planet) {
    throw new Error('No matching planet was found');
  }
  await launchesDb.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb
    .findOne()
    .sort('-flightNumber');
  if (!latestLaunch) {
    return 0;
  }
  return latestLaunch.flightNumber;
}

async function existsLaunchWithId(launchId) {
  return launchesDb.findOne({ flightNumber: launchId });
}

async function getAllLaunches() {
  return launchesDb
    .find({}, { _id: 0, __v: 0 });
}

async function addNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });
  await saveLaunches(newLaunch);
}

async function abortLaunchById(launchId) {
  await launchesDb.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
