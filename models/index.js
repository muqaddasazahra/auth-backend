const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 
const User = require("./user"); 
const PasswordReset = require("./PasswordReset"); 

const models = {
  User: User(sequelize, DataTypes), 
  PasswordReset: PasswordReset(sequelize, DataTypes), 
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synced successfully");
    console.log("Models created:", Object.keys(models));
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

syncModels(); 

module.exports = {syncModels, models}; 
