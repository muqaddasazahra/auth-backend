const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      len: [3, 50], 
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [6, 100], 
    },
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  provider: {
    type: DataTypes.ENUM("Standard", "SOS", "SocialMedia"),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  sosCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  socialId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

  User.beforeCreate(async (user) => {
    if (user.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  });


  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
   User.associate = (models) => {
     User.hasMany(models.PasswordReset, {
       foreignKey: "userId",
       onDelete: "CASCADE",
     });
   };
  return User;
};
