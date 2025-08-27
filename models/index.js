const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 
const User = require("./user"); 


const models = {
  User: User(sequelize, DataTypes), 
};


const syncModels = async () => {
  try {
    await sequelize.sync({ force: true }); 
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

syncModels(); 

module.exports = models; 
