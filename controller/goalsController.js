const { v4: uuidv4 } = require("uuid");
//// IMPORT MODELS
const GoalModel = require("../models").dbGoals;
const UserModel = require("../models").dbUsers;
const AllPivot = require("../models").allPivot;
const StampGoal = require("../models").StampGoal;

/// ADD GOALS
const addGoal = async (req, res) => {
  try {
    let body = req.body;
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
    const goalData = await UserModel.findAndCountAll({
      include: [
        {
          model: GoalModel,
          require: true,
          as: "goals",
        },
      ],
    });

    return res.json({
      status: "Success",
      messege: "Succesfully fetching all goals data",
      lengthData: goalData.length,
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
    const goalData = await UserModel.findAndCountAll({
      where: { id: id },
      include: [
        {
          model: GoalModel,
          require: true,
          as: "goals",
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
    const { status, isArchive } = req.body;
    const dataGoal = await GoalModel.findOne({ where: { goalId: goalId } });
    if (dataGoal === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    if (status === null) {
      await GoalModel.update(
        {
          isArchive: isArchive,
        },
        {
          where: {
            goalId: goalId,
          },
        }
      );
    } else {
      await GoalModel.update(
        {
          rate: status === "ongoing" ? 60 : 100,
          status: status,
        },
        {
          where: {
            goalId: goalId,
          },
        }
      );
    }

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
// ADD IMAGE
const addImageGoal = async (req, res) => {
  try {
    let body = req.body;
    const { goalId } = req.params;
    if (req.file?.path === undefined)
      return res.status(422).json({
        status: "Failed",
        message: "No image choosen",
      });
    body.image = req.file.path;
    const myArray = body.image.split("/v");
    const tes = myArray[0] + "/c_thumb,h_400,w_400/v" + myArray[1];
    await GoalModel.update(
      {
        image: tes,
      },
      { where: { goalId: goalId } }
    );

    res.json({
      status: "Success",
      messege: "Succesfully adding image of goal",
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
    const dataGoal = await GoalModel.findOne({ where: { goalId: goalId } });
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
    const { status, goalId, isArchive } = req.body;
    let count = 0;
    await Promise.all(
      goalId.map(async (data) => {
        if (status === null) {
          const updateData = await GoalModel.update(
            {
              isArchive: isArchive,
            },
            {
              where: {
                goalId: data,
              },
            }
          );
          if (updateData) {
            count = count + 1;
          }
        } else {
          const updateData = await GoalModel.update(
            {
              status: status,
              rate: status === "ongoing" ? 60 : 100,
              isArchive: isArchive,
            },
            {
              where: {
                goalId: data,
              },
            }
          );
          if (updateData) {
            count = count + 1;
          }
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
  addImageGoal,
  deleteGoal,
  deleteMultiGoals,
  updateMultiGoals,
  getGoalsByUserNow,
};
