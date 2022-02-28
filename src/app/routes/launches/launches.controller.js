const {
  getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById,
} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: 'Missing required launch properties',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (launch.launchDate.toString() === 'Invalid Date') {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await addNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const existLaunch = await existsLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  const aborted = await abortLaunchById(launchId);
  return res.status(200).json({
    aborted,
    message: 'Launch aborted',
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
