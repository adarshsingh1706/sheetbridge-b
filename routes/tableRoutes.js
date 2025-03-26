const express = require("express");
const Table = require("../models/table");
const router = express.Router();

// Route to create a table
router.post("/create-table", async (req, res) => {
  try {
    const { userId, tableName, columns } = req.body;

    if (!userId || !tableName || !columns || columns.length === 0) {
      return res.status(400).json({ error: "Table name and columns are required" });
    }

    // Create a new table
    const newTable = new Table({
      userId,
      tableName,
      columns,
      rows: [],  // Initializing rows as an empty array
    });

    // Save table to the database
    const savedTable = await newTable.save();

    res.status(201).json({
      message: "Table created successfully",
      table: savedTable,
    });
  } catch (error) {
    console.error("Error in create-table:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
