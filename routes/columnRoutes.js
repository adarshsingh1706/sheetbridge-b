const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const columnController = require("../controllers/columnController");

const router = express.Router();

router.post("/add-column", authMiddleware, columnController.addColumn);
router.get("/get-columns", authMiddleware, columnController.getColumns);

module.exports = router;
