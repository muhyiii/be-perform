const express = require("express");
const {
  addGoal,
  getAllGoals,
  getGoalById,
  editStatusByUser,
  deleteMultiGoals,
  deleteGoal,
  updateMultiGoals,
  getGoalsByUserNow,
  addImageGoal,
} = require("../controller/goalsController");
const {
  getAllMA,
  addMA,
  getMaByGoalId,
  getMaByUserNow,
  deleteMa,
  editStatusMaByUser,
  getMAbyId,
  deleteMultiMA,
  updateMultiMA,
} = require("../controller/maController");
const { getPeriods, createPeriod } = require("../controller/periodController");
const {
  registerUser,
  getAllUsers,
  loginUser,
  getUserById,
  registerUserBiodata,

  usersStaticAll,
  deleteUser,
} = require("../controller/userController");
const { upload } = require("../middleware/uploadCloudinary");
const validationMiddleware = require("../middleware/ValidationMiddleware");
const { userValidator } = require("../validator/RegisterValidator");
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    status: "Success",
    message: "Connected to Our API",
  });
});

// USERS
////  REGISTER USER
router.post(
  "/register-account",
  userValidator,
  validationMiddleware,
  registerUser
);
//// COUNTINUE REGISTER
router.post(
  "/register-account/continue/:idUser",
  upload.single("image", { width: 200, height: 200, crop: "fill" }),
  registerUserBiodata
);
//// LOGIN USER
router.post("/login-account", loginUser);
// GET ALL DATA USERS
router.get("/data/users", getAllUsers);
// GET ALL STATIC USER
router.get("/data/users/staticAll", usersStaticAll);
// GET ONE DATA USER
router.get("/data/users/:id", getUserById);
// DELETE USER
router.delete("/data/users/:id/delete", deleteUser);

// GOALS
//// ADD GOAL
router.post("/add-goal", addGoal);
// GET ALL DATA GOALS
router.get("/data/goals", getAllGoals);
// GET GOALS BY USER NOW
router.get("/data/goals/user/:id", getGoalsByUserNow);
// GET GOAL BY ID
router.get("/data/goals/:goalId", getGoalById);
// UPDATE IMAGE GOAL
router.put(
  "/data/goals/:goalId/update/image",
  upload.single("image"),
  addImageGoal
);
// UPDATE STATUS BY USER
router.put(
  "/data/goals/:goalId/update",

  editStatusByUser
);
// DELETE GOAL BY ID
router.delete("/data/goals/:goalId/delete", deleteGoal);
// DELETE MULTI GOALS
router.post("/data/goals/multiple/delete", deleteMultiGoals);
// UPDATE MULTI GOALS
router.post("/data/goals/multiple/update", updateMultiGoals);

// MEASURED ACTIVITY
//// GET ALL MEASURED DATA
router.get("/data/measured-activities", getAllMA);
//// ADD MEASURED ACTIVITY
router.post("/add-measured-activity", addMA);
// GET MEASURED ACTIVITY BY USER NOW
router.get("/data/measured-activities/user/:userId", getMaByUserNow);
// GET MEASURED ACTIVITY BY GOAL ID
router.get("/data/measured-activities/goal/:goalId", getMaByGoalId);
// GET MEASURED ACTIVITY BY  ID
router.get("/data/measured-activities/:maId", getMAbyId);
// UPDATE STATUS BY USER
router.delete("/data/measured-activities/:maId/delete", deleteMa);
// UPDATE STATUS BY USER
router.put("/data/measured-activities/:maId/update", editStatusMaByUser);
// DELETE MULTI MEASURE ACTIVITY
router.post("/data/measured-activities/multiple/delete", deleteMultiMA);
// UPDATE MULTI MEASURE ACTIVITY
router.post("/data/measured-activities/multiple/update", updateMultiMA);

// PERIOD
///// GET ALL PERIODS
router.get("/data/periods", getPeriods);
///// ADD PERIOD
router.post("/add-period", createPeriod);
module.exports = router;
