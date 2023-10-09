const Sequelize = require("sequelize");
const Op = require("sequelize");
const sequelize = require("../util/database");
const Usergroup = sequelize.define(
  "usergroup",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    isAdmin: Sequelize.BOOLEAN,
  },
  {
    timestamps: false,
  }
);
module.exports = Usergroup;
