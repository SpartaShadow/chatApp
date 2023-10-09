const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Archived = sequelize.define(
  "archived",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: Sequelize.STRING,
    name: Sequelize.STRING,
    userId: Sequelize.INTEGER,
    grpId: Sequelize.INTEGER,
    sendAt: Sequelize.DATE,
  },
  {
    timestamps: false,
  }
);
module.exports = Archived;
