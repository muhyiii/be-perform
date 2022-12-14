"use strict";
const { Model } = require("sequelize");
const db = require(".");
module.exports = (sequelize, DataTypes) => {
  class dbMa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dbMa.belongsToMany(models.dbUsers, {
        through: models.allPivot,
        as: "users",
        foreignKey: "idMa",
      });
      dbMa.belongsToMany(models.dbGoals, {
        through: models.allPivot,
        as: "goals",
        foreignKey: "idMa",
      });
      dbMa.belongsTo(models.dbUsers, {
        as: "user",
        foreignKey: "id",
      });
      dbMa.belongsTo(models.dbGoals, {
        as: "goal",
        foreignKey: "id",
      });
      dbMa.hasOne(models.stampMa, {
        as: "stampMa",
        foreignKey: "idMa",
      });
    }
  }
  dbMa.init(
    {
      idUser: DataTypes.INTEGER,
      idGoal: DataTypes.INTEGER,
      maId: DataTypes.STRING,
      status: DataTypes.ENUM("to-do", "ongoing", "hold", "done"),
      task: DataTypes.STRING,
      description: DataTypes.STRING,
      rate: DataTypes.INTEGER,
      value: DataTypes.INTEGER,
      isArchive: DataTypes.BOOLEAN(true, false),
      image: DataTypes.STRING,
      fromDate: DataTypes.DATE,
      toDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "dbMa",
    }
  );
  return dbMa;
};
