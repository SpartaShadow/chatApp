const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Msg = sequelize.define(
  "msg",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: Sequelize.STRING,
  },
  {
    timestamps: true,
    createdAt: "Send At",
    updatedAt: false,
  }
);
module.exports = Msg;
