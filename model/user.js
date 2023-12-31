const Sequelize = require("sequelize");
const Op = require("sequelize");
const sequelize = require("../util/database");
const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    number: Sequelize.STRING,
    password: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);
module.exports = User;
