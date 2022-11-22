"use strict";

const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dbGoals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idUser: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "dbUsers",
          key: "id",
          as: "idUser",
        },
      },
      goalId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("to-do", "ongoing", "hold", "done"),
      },
      task: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      rate: {
        type: Sequelize.INTEGER,
      },
      value: {
        type: Sequelize.INTEGER,
      },
      isArchive: {
        type: Sequelize.BOOLEAN(true, false),
      },
      image: {
        type: Sequelize.STRING,
      },
      fromDate: {
        type: Sequelize.DATE,
      },
      toDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("dbGoals");
  },
};
