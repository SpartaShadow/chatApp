const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Grp = sequelize.define(
  "grp",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    grpName: Sequelize.STRING,
  },
  {
    timestamps: false,
  }
);
module.exports = Grp;
