const axios = require('axios');
const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');

async function findLaunch(filter) {
  return launchesDb.findOne(filter);
}

async function saveLaunches(launch) {
  await launchesDb.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function insertMany(launches) {
  await launchesDb.insertMany(launches, (err, docs) => {
    if (err || !docs) {
      console.log(err);
      return;
    }
    console.log('Launches loaded');
  });
}

async function populateLaunches() {
  console.log('Downloading launch data');
  const response = await axios.post('https://api.spacexdata.com/v4/launches/query', {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  const launches = launchDocs.map((launchDoc) => (
    {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: launchDoc.payloads.flatMap((payload) => payload.customers),
    }
  ));

  await insertMany(launches);
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

// End of helper functions
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data is already loaded');
  } else {
    await populateLaunches();
  }
}

async function existsLaunchWithId(launchId) {
  return findLaunch({ flightNumber: launchId });
}

// Get all launches with pagination
async function getAllLaunches(skip, limit) {
  return launchesDb
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });
  if (!planet) {
    throw new Error('No matching planet was found');
  }

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
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
