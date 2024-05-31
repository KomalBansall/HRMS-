const leavetypeModel = require("../models/leave.type.model.js");
// const adminleavecreate = require("../models/adminleavecount.model.js");
// const adminleavecount = require("../models/adminleavecount.model");
const { startCase } = require("lodash");
const leaveModel = require("../models/leave.model.js");

//  Register Leave
leaveRegister = async (req, res) => {
  let { leaveType, LeaveCount } = req.body;
  try {
    const result = await leavetypeModel.create({
      leaveType: req.body.leaveType,
      LeaveCount:req.body.LeaveCount
    });
    res.status(200).json({
      status: "200",
      message: "Leave-Type create successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "400", message: error.message });
  }
};
//get leave list
leavesList = async (req, res) => {
  try {
    const result = await leavetypeModel.find();
    res.status(200).json({
      status: "200",
      message: "completed succesfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "500",
      message: " Something went wrong",
      error: error.message,
    });
  }
};

// //  Admin Leave Count
// adminCount = async (req, res) => {
//   let { leaveType_id, LeaveCount } = req.body;
//   try {
//     const result = await adminleavecount.create({
//       leaveType_id: req.body.leaveType_id,
//       LeaveCount: LeaveCount,
//     });
//     res.status(200).json({
//       status: "200",
//       message: "Leave-Type create successfully",
//       response: result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(200).json({ status: "400", message: error.message });
//   }
// };

// getLeavesList = async (req, res) => {
//   try {
//     const result = await adminleavecount.find();
//     res.status(200).json({
//       status: "200",
//       message: "completed succesfully",
//       response: result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(200).json({
//       status: "500",
//       message: " Something went wrong",
//       error: error.message,
//     });
//   }
// };
module.exports = { leaveRegister, leavesList };
