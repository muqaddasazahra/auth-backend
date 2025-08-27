const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const PasswordReset = sequelize.define("PasswordReset", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

PasswordReset.belongsTo(User, { foreignKey: "userId" });

module.exports = PasswordReset;
