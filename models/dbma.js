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
        as: "users",
        foreignKey: "idMa",
        through: models.allPivot,
      });
      dbMa.belongsToMany(models.dbGoals, {
        as: "goals",
        foreignKey: "idGoal",
        through: models.allPivot,
      });
      dbMa.belongsTo(models.dbUsers, {
        as: "user",
        foreignKey: "id",
      });
      dbMa.belongsTo(models.dbGoals, {
        as: "goal",
        foreignKey: "id",
      });
    }
  }
  dbMa.init(
    {
      idUser: DataTypes.INTEGER,
      goalId: DataTypes.STRING,
      status: DataTypes.ENUM("to-do", "ongoing", "held", "done"),
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
