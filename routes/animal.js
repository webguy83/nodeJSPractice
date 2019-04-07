const express = require('express');
const path = require('path');

const animalController = require('../controllers/animals');

const router = express.Router();

router.get('/donkey', animalController.getDonkeyPage);

module.exports = router;