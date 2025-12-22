const express = require("express");
const { connectDB } = require("./config/database.js");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());

connectDB();



app.use("/api/v1/auth" ,authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


