const ColumnConfig = require("../models/columnConfig");

exports.addColumn = async (req, res) => {
  try {
      const { columnName, columnType } = req.body;
      const userId = req.user;

      if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
      }

      if (!columnName || !columnType) {
          return res.status(400).json({ error: "Column Name and Type are required" });
      }

      let columnConfig = await ColumnConfig.findOne({ userId });

      if (!columnConfig) {
          columnConfig = new ColumnConfig({ userId, columns: [] });
      }

      // Add column to the schema
      columnConfig.columns.push({ name: columnName, type: columnType });

      const savedColumnConfig = await columnConfig.save();

     
      console.log("Column added for User ID:", userId);

      res.status(201).json({ message: "Column added successfully", columnConfig: savedColumnConfig });
  } catch (error) {
      // errors for debugging
      console.error("Error in addColumn:", error);
      res.status(500).json({ error: "Server error" });
  }
};

exports.getColumns = async (req, res) => {
    try {
        const userId = req.user;

        const columnConfig = await ColumnConfig.findOne({ userId });

        res.json(columnConfig ? columnConfig.columns : []);
    } catch (error) {
        console.error("Error in getColumns:", error);
        res.status(500).json({ error: "Failed to fetch columns" });
    }
};
