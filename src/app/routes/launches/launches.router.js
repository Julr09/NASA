const express = require('express');
const launchesController = require('./launches.controller');

const router = express.Router();

router.get('/', launchesController.httpGetAllLaunches);
router.post('/', launchesController.httpAddNewLaunch);
router.delete('/:id', launchesController.httpAbortLaunch);

module.exports = router;
