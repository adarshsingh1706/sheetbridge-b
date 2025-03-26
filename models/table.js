const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tableName: { type: String, required: true },
  columns: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true }, // Text or Date
    },
  ],
});

module.exports = mongoose.model("Table", tableSchema);
