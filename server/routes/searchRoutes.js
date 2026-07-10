const express = require("express");
const { webSearchController } = require("../controllers/searchController");

const router = express.Router();

router.post("/web", webSearchController);

module.exports = router;