const { v4: uuidv4 } = require("uuid");
//// IMPORT MODELS
const GoalModel = require("../models").dbGoals;
const UserModel = require("../models").dbUsers;
const AllPivot = require("../models").allPivot;

/// ADD GOALS
const addGoal = async (req, res) => {
  try {
    let body = req.body;
    // let goalId = ;
    // return res.send(goalId)
    const goals = await GoalModel.create({
      goalId: uuidv4(),
      idUser: body.userId,
      status: "to-do",
      task: body.task,
      description: body.description,

      rate: 0,
      value: 0,
      isArchive: false,
      image: body.image,
      fromDate: body.fromDate,
      toDate: body.toDate,
    });
    const pivot = await AllPivot.create({
      idUser: body.userId,
      idGoal: goals.id,
      idMa: null,
    });
    res.status(200).json({
      status: "Success",
      messege: "Succesfully add new goal",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

/// GET GOALS
const getAllGoals = async (req, res) => {
  try {
    const goalData = await GoalModel.findAndCountAll({
      attributes: [
        "id",
        "idUser",
        "goalId",
        "status",
        "task",
        "description",
        "value",
        "image",
        "rate",
        "isArchive",
        "fromDate",
        "toDate",
        "createdAt",
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
      ],
    });

    return res.json({
      status: "Success",
      messege: "Succesfully fetching all goals data",
      data: goalData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// GET GOALS BY USER NOW
const getGoalsByUserNow = async (req, res) => {
  try {
    const { id } = req.params;
    const goalData = await GoalModel.findAndCountAll({
      attributes: [
        "id",
        "idUser",
        "goalId",
        "status",
        "task",
        "description",
        "rate",
        "value",
        "image",
        "isArchive",
        "fromDate",
        "toDate",
        "createdAt",
      ],
      where: { idUser: id },
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
      ],
    });
    if (goalData === null) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    return res.json({
      status: "Success",
      messege: "Succesfully fetching goal data",
      data: goalData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// GET GOAL BY ID
const getGoalById = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goalData = await GoalModel.findOne({
      attributes: [
        "id",
        "idUser",
        "goalId",
        "status",
        "task",
        "description",
        "rate",
        "value",
        "image",
        "fromDate",
        "toDate",
      ],
      where: { goalId: goalId },
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
      ],
    });
    if (goalData === null) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    return res.json({
      status: "Success",
      messege: "Succesfully fetching goal data",
      data: goalData,
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
const editStatusByUser = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { status } = req.body;
    const dataGoal = await GoalModel.findOne({ where: { goalId: goalId } });
    if (dataGoal === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    await GoalModel.update(
      { status: status, rate: status === "ongoing" ? 60 : 100 },
      {
        where: {
          goalId: goalId,
        },
      }
    );

    return res.json({
      status: "Success",
      messege: "Your status has been updated",
      data: dataGoal,
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
const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    // return res.send({status,g})
    const dataGoal = await GoalModel.findOne({ where: { goalId: goalId } });
    // return res.send(dataGoal)
    if (dataGoal === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    await GoalModel.destroy({
      where: {
        goalId: goalId,
      },
    });

    return res.json({
      status: "Success",
      messege: "Your goal has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

// DELETE MULTI GOALS
const deleteMultiGoals = async (req, res) => {
  try {
    const { multiId } = req.body;

    let count = 0;

    await Promise.all(
      multiId.map(async (data) => {
        const deleteData = await GoalModel.destroy({
          where: {
            goalId: data,
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
const updateMultiGoals = async (req, res) => {
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
  addGoal,
  getAllGoals,
  getGoalById,
  editStatusByUser,
  deleteGoal,
  deleteMultiGoals,
  updateMultiGoals,
  getGoalsByUserNow,
};
