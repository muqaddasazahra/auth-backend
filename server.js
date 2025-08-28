const express = require("express");
const { connectDB } = require("./config/db");
const { syncModels } = require("./models")
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwordRoutes");


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);

const startServer = async () => {
  try {

    await connectDB();

    await syncModels();

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port", process.env.PORT || 5000);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();