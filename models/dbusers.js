"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dbUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dbUsers.belongsToMany(models.dbGoals, {
        through: models.allPivot,
        as: "goals",
        foreignKey: "idUser",
      });
      dbUsers.belongsToMany(models.dbMa, {
        through: models.allPivot,
        as: "ma",
        foreignKey: "idMa",
      });
    }
  }
  dbUsers.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      role: DataTypes.STRING,
      position: DataTypes.STRING,
      birthday: DataTypes.DATEONLY,
      image:DataTypes.STRING
    },
    {
      sequelize,
      modelName: "dbUsers",
    }
  );
  return dbUsers;
};
