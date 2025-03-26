const mongoose = require("mongoose");

const columnConfigSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  columns: [
    {
      name: String,
      type: { type: String, enum: ["Text", "Date"], default: "Text" },
    },
  ],
});

module.exports = mongoose.model("ColumnConfig", columnConfigSchema);
