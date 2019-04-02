const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');

const router = express.Router();

router.get("/donkey", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "donkey.html"));
});

module.exports = router;