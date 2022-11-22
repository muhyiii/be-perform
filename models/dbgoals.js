"use strict";
const { Model } = require("sequelize");
const db = require(".");
module.exports = (sequelize, DataTypes) => {
  class dbGoals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dbGoals.belongsToMany(models.dbUsers, {
        through: models.allPivot,
        as: "users",
        foreignKey: "idGoal",
      });
      dbGoals.belongsToMany(models.dbMa, {
        through: models.allPivot,
        as: "mas",
        foreignKey: "idMa",
      });
      dbGoals.belongsTo(models.dbUsers, {
        as: "user",
        foreignKey: "id",
      });
    }
  }
  dbGoals.init(
    {
      idUser: DataTypes.INTEGER,
      goalId: DataTypes.STRING,
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
      modelName: "dbGoals",
    }
  );
  return dbGoals;
};
