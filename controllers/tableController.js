const Table = require("../models/table");

exports.createTable = async (req, res) => {
  try {
      const { tableName, columns } = req.body;  // Columns will be an array of { name, type }
      const userId = req.user;

      if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
      }

      if (!tableName || !columns || columns.length === 0) {
          return res.status(400).json({ error: "Table Name and Columns are required" });
      }

      // Create the new table with userID, table name, and columns
      const newTable = new Table({
          userId,
          tableName,
          columns,  // Example: [{ name: "Age", type: "Text" }, { name: "Birthdate", type: "Date" }]
      });

      const savedTable = await newTable.save();
      console.log("Table created for User ID:", userId);

      res.status(201).json({
          message: "Table created successfully",
          table: savedTable,
      });
  } catch (error) {
      console.error("Error in createTable:", error);
      res.status(500).json({ error: "Server error" });
  }
};
