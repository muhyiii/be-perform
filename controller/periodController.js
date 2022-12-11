const PeriodModel = require("../models").period;

const createPeriod = async (req, res) => {
  try {
    const body = req.body;
    const newPeriod = await PeriodModel.create(body);
    return res.json({
      status: "Success",
      messege: "Succesfully add new period data",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

const getPeriods = async (req, res) => {
  try {
    const dataPeriod = await PeriodModel.findAndCountAll();
    return res.send({
      status: "Success",
      messege: "Succesfully fetching all periods data",
      data: dataPeriod,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

module.exports = { createPeriod, getPeriods };
