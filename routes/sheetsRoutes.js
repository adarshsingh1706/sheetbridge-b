const express = require("express");
const sheetsController = require("../controllers/sheetsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/data", authMiddleware, sheetsController.getSheetData);
router.post("/add-row", authMiddleware, sheetsController.addRow);

module.exports = router;
