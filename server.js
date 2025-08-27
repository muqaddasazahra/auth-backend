const express = require("express");
const { sequelize } = require("./config/db"); 
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwordRoutes");
const { connectDB } = require("./config/db"); 

const app = express();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes); 

sequelize
  .sync({ force: false }) 
  .then(() => {
    console.log("Database synchronized successfully!");


    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      connectDB(); 
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
