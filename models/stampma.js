"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stampMa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      stampMa.belongsTo(models.dbGoals, {
        as: "ma",
        foreignKey: "id",
      });
    }
  }
  stampMa.init(
    {
      activity: DataTypes.STRING,
      time: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "stampMa",
    }
  );
  return stampMa;
};
