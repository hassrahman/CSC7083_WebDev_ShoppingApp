const express = require("express");
const statsController = require("./../controllers/statsController");
const router = express.Router();

//defines the API route for getting statistics
router.get("/:userId", statsController.getStats);

module.exports = router;