require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sheetsRoutes = require("./routes/sheetsRoutes"); 
const columnRoutes = require("./routes/columnRoutes"); 
const tableRoutes = require("./routes/tableRoutes");


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Routes
app.use("/api/tables", tableRoutes);  
app.use("/api/columns", columnRoutes); 
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/sheets", sheetsRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
