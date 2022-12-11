"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class period extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  period.init(
    {
      period: DataTypes.STRING,
      fromDate: DataTypes.DATE,
      toDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "period",
    }
  );
  return period;
};
