const { v4: uuidv4 } = require("uuid");
//// IMPORT MODELS
const GoalsModel = require("../models").dbGoals;
const UserModel = require("../models").dbUsers;
const AllPivot = require("../models").allPivot;

/// ADD GOALS
const addMA = async (req, res) => {
  try {
    let body = req.body;
    // let goalId = ;
    // return res.send(goalId)
    const measured = await GoalsModel.create({
      goalId: uuidv4(),
      idUser: body.userId,
      goalId: body.goalId,
      status: "to-do",
      task: body.task,
      description: body.description,
      //   rate: 0,
      value: 0,
      isArchive: false,
      image: body.image,
      fromDate: body.fromDate,
      toDate: body.toDate,
    });
    const pivot = await AllPivot.create({
      idUser: body.userId,
      idGoal: body.goalId,
      idMa: measured.idF,
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

/// GET GOALS
const getAllMA = async (req, res) => {
  try {
    const measuredData = await GoalsModel.findAllAndCount({
      attributes: [
        "id",
        "idUser",
        "goalId",
        "status",
        "task",
        "description",
        "image",
        "value",
        "isArchive",    
        // "rate",
        "fromDate",
        "toDate",
      ],
      include: [
        {
          model: UserModel,
          require: true,
          as: "users",
          attributes: ["name", "role"],
          through: {
            attributes: [],
          },
        },
        {
          model: GoalsModel,
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

// GET GOAL BY ID
const getMAbyId = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goalData = await GoalsModel.findOne({
      attributes: [
        "id",
        "idUser",
        "goalId",
        "status",
        "task",
        "description",
        "image",
        "isArchive",
        // "rate",
        "fromDate",
        "toDate",
      ],
      where: { goalId: goalId },
      include: [
        {
          model: UserModel,
          require: true,
          as: "users",
          attributes: ["name", "role"],
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
    // return res.send({status,g})
    const dataGoal = await GoalsModel.findOne({ where: { goalId: goalId } });
    // return res.send(dataGoal)
    if (dataGoal === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    await GoalsModel.update(
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
    const dataGoal = await GoalsModel.findOne({ where: { goalId: goalId } });
    // return res.send(dataGoal)
    if (dataGoal === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    await GoalsModel.destroy({
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
        const deleteData = await GoalsModel.destroy({
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
        const updateData = await GoalsModel.update(
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
  editStatusByUser,
  deleteGoal,
  deleteMultiGoals,
  updateMultiGoals,
};
