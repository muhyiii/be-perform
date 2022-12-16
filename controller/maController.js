const { v4: uuidv4 } = require("uuid");
//// IMPORT MODELS
const GoalModel = require("../models").dbGoals;
const MAModel = require("../models").dbMa;
const UserModel = require("../models").dbUsers;
const AllPivot = require("../models").allPivot;
const StampMa = require("../models").stampMa;

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
        // {
        //   model: StampMa,
        //   require: true,
        //   as: "stampMa",
        // },
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
        // {
        //   model: StampMa,
        //   require: true,
        //   as: "stampMa",
        // },
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
        // {
        //   model: StampMa,
        //   require: true,
        //   as: "stampMa",
        // },
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
        // {
        //   model: StampMa,
        //   require: true,
        //   as: "stampMa",
        // },
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
    const measuredData = await MAModel.findOne({ where: { maId: maId } });
    if (measuredData === 0) {
      return res.json({
        status: "Failed",
        messege: "Data is undefined",
      });
    }
    if (status === null) {
      await MAModel.update(
        {
          isArchive: isArchive,
        },
        {
          where: {
            maId: maId,
          },
        }
      );
      await stampMa.create({
        idMa: maId,
        activity: isArchive ? "Set ma to archive" : "Undo archive ma",
        time: Date(),
      });
    } else {
      await MAModel.update(
        {
          status: status,
          rate: status === "ongoing" ? 60 : 100,
        },
        {
          where: {
            maId: maId,
          },
        }
      );
      // await StampMa.create({
      //   idMa: maId,
      //   activity:
      //     status === "ongoing"
      //       ? "Task is started"
      //       : status === "hold"
      //       ? "Task is held"
      //       : "Task is completed",
      //   time: Date(),
      // });
    }
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
// ADD IMAGE MA
const addImageMa = async (req, res) => {
  try {
    let body = req.body;
    const { maId } = req.params;
    if (req.file?.path === undefined)
      return res.status(422).json({
        status: "Failed",
        message: "No image choosen",
      });
    body.image = req.file.path;
    const myArray = body.image.split("/v");
    const tes = myArray[0] + "/c_thumb,h_400,w_400/v" + myArray[1];
    await MAModel.update(
      {
        image: tes,
      },
      { where: { maId: maId } }
    );

    res.json({
      status: "Success",
      messege: "Succesfully adding image of measure activity",
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
    const measuredData = await MAModel.findOne({ where: { maId: maId } });
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
        const deleteData = await MAModel.destroy({
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
      messege: `${count} measure activity has been deleted`,
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
    const { status, maId, isArchive } = req.body;
    let count = 0;
    await Promise.all(
      maId.map(async (data) => {
        if (status === null) {
          const updateData = await MAModel.update(
            {
              isArchive: isArchive,
            },
            {
              where: {
                maId: data,
              },
            }
          );
          if (updateData) {
            count = count + 1;
          }
        } else {
          const updateData = await MAModel.update(
            {
              status: status,
              rate: status === "ongoing" ? 60 : 100,
              isArchive: isArchive,
            },
            {
              where: {
                maId: data,
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
      messege: `${count} Measure activity has been updated`,
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
  addImageMa,
  deleteMa,
  deleteMultiMA,
  updateMultiMA,
};
