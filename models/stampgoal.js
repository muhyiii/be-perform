"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stampGoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      stampGoal.belongsTo(models.dbGoals, {
        as: "goal",
        foreignKey: "id",
      });
    }
  }
  stampGoal.init(
    {
      idGoal: DataTypes.INTEGER,
      activity: DataTypes.STRING,
      time: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "stampGoal",
    }
  );
  return stampGoal;
};
