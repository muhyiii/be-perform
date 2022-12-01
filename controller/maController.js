const { v4: uuidv4 } = require("uuid");
//// IMPORT MODELS
const GoalModel = require("../models").dbGoals;
const MAModel = require("../models").dbMa;
const UserModel = require("../models").dbUsers;
const AllPivot = require("../models").allPivot;

/// ADD MA
const addMA = async (req, res) => {
  try {
    let body = req.body;
    const measured = await MAModel.create({
      idUser: body.userId,
      idGoal: body.goalId,
      maId: uuidv4(),
      status: "to-do",
      task: body.task,
      description: body.description,
      rate: 0,
      value: 0,
      isArchive: false,
      //   image: body.image,
      fromDate: body.fromDate,
      toDate: body.toDate,
    });
    const pivot = await AllPivot.create({
      idUser: body.userId,
      idGoal: body.goalId,
      idMa: measured.id,
    });
    res.status(200).json({
      status: "Success",
      messege: "Succesfully add new measured activity",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

/// GET ALL MA
const getAllMA = async (req, res) => {
  try {
    const measuredData = await MAModel.findAndCountAll({
      attributes: [
        "id",
        "idUser",
        "idGoal",
        "maId",
        "status",
        "task",
        "description",
        "image",
        "value",
        "isArchive",
        "rate",
        "fromDate",
        "toDate",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          require: true,
          as: "users",
          attributes: ["name", "role", "image"],
          through: {
            attributes: [],
          },
        },
        {
          model: GoalModel,
          require: true,
          as: "goals",
          attributes: ["task", "description"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.json({
      status: "Success",
      messege: "Succesfully fetching all measured activity data",
      data: measuredData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// GET MA BY ID
const getMAbyId = async (req, res) => {
  try {
    const { maId } = req.params;

    const measuredData = await MAModel.findOne({
      attributes: [
        "id",
        "idUser",
        "idGoal",
        "maId",
        "status",
        "task",
        "description",
        "image",
        "value",
        "isArchive",
        "rate",
        "fromDate",
        "toDate",
        "createdAt",
        "updatedAt",
      ],
      where: { maId: maId },
      include: [
        {
          model: UserModel,
          require: true,
          as: "users",
          attributes: ["name", "role", "image"],
          through: {
            attributes: [],
          },
        },
        {
          model: GoalModel,
          require: true,
          as: "goals",
          attributes: ["task", "description"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (measuredData === null) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    return res.json({
      status: "Success",
      messege: "Succesfully fetching data of measured activity",
      data: measuredData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};
// GET MA BY USER ID
const getMaByUserNow = async (req, res) => {
  try {
    const { userId } = req.params;

    const measuredData = await MAModel.findAndCountAll({
      attributes: [
        "id",
        "idUser",
        "idGoal",
        "maId",
        "status",
        "task",
        "description",
        "image",
        "value",
        "isArchive",
        "rate",
        "fromDate",
        "toDate",
        "updatedAt",
      ],
      where: { idUser: userId },
      include: [
        {
          model: UserModel,
          require: true,
          as: "users",
          attributes: ["name", "role", "image"],
          through: {
            attributes: [],
          },
        },
        {
          model: GoalModel,
          require: true,
          as: "goals",
          attributes: ["task", "description"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (measuredData === null) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    return res.json({
      status: "Success",
      messege: "Succesfully fetching data of measured activity",
      data: measuredData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// GET MA BY GOAL ID
const getMaByGoalId = async (req, res) => {
  try {
    const { goalId } = req.params;

    const measuredData = await MAModel.findAndCountAll({
      attributes: [
        "id",
        "idUser",
        "idGoal",
        "maId",
        "status",
        "task",
        "description",
        "image",
        "value",
        "isArchive",
        "rate",
        "fromDate",
        "toDate",
        "updatedAt",
      ],
      where: { idGoal: goalId },
      include: [
        {
          model: UserModel,
          require: true,
          as: "users",
          attributes: ["name", "role", "image"],
          through: {
            attributes: [],
          },
        },
        {
          model: GoalModel,
          require: true,
          as: "goals",
          attributes: ["task", "description"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (measuredData === null) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    return res.json({
      status: "Success",
      messege: "Succesfully fetching data of measured activity",
      data: measuredData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// EDIT STATUS BY USER
const editStatusMaByUser = async (req, res) => {
  try {
    const { maId } = req.params;
    const { status, isArchive } = req.body;
    // return res.send({status,g})
    const measuredData = await MAModel.findOne({ where: { maId: maId } });
    // return res.send(measuredData)
    if (measuredData === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    await MAModel.update(
      {
        status: status,
        rate: status === "ongoing" ? 60 : 100,
        isArchive: isArchive,
      },
      {
        where: {
          maId: maId,
        },
      }
    );

    return res.json({
      status: "Success",
      messege: "Your status has been updated",
      data: measuredData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};
// DELETE GOALS BY 1
const deleteMa = async (req, res) => {
  try {
    const { maId } = req.params;

    // return res.send({status,g})
    const measuredData = await MAModel.findOne({ where: { maId: maId } });
    // return res.send(measuredData)
    if (measuredData === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    await MAModel.destroy({
      where: {
        maId: maId,
      },
    });

    return res.json({
      status: "Success",
      messege: "Your measured activity has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// DELETE MULTI MA
const deleteMultiMA = async (req, res) => {
  try {
    const { multiId } = req.body;

    let count = 0;

    await Promise.all(
      multiId.map(async (data) => {
        const deleteData = await GoalModel.destroy({
          where: {
            maId: data,
          },
        });
        if (deleteData) {
          count = count + 1;
        }
      })
    );

    return res.json({
      status: "Success",
      messege: `${count} Goals has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// UPDATE MULTI GOALS
const updateMultiMA = async (req, res) => {
  try {
    const { status, goalId } = req.body;
    // const status = payload.status;
    // return res.send(payload)
    let count = 0;

    await Promise.all(
      goalId.map(async (data) => {
        const updateData = await GoalModel.update(
          { status: status, rate: status === "ongoing" ? 60 : 100 },
          {
            where: {
              goalId: data,
            },
          }
        );
        if (updateData) {
          count = count + 1;
        }
      })
    );

    return res.json({
      status: "Success",
      messege: `${count} Goals has been updated`,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

module.exports = {
  addMA,
  getAllMA,
  getMAbyId,
  getMaByUserNow,
  getMaByGoalId,
  editStatusMaByUser,
  deleteMa,
  deleteMultiMA,
  updateMultiMA,
};
