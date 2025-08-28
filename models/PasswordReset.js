const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  PasswordReset.associate = (models) => {
    PasswordReset.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return PasswordReset;
};
