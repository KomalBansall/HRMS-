const leaveModel = require("../models/leave.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const employeeModel = require("../models/employee.model");

// Api for  Manager updating leave status of employess
managerupdateleavestatus = async (req, res) => {
  try {
    const objData = {
      LeaveCount: 7,
      availd_leave: req.query.availd_leave,
      status: "pending",
    };
    const result = await leaveModel.findByIdAndUpdate(
      { _id: req.params.id },
      { status: req.params.status }
    );
    if (result) {
      if (result.status === "approved") {
        const countavaild = await leaveModel.find({
          _id: result.leavetype,
          status: "approved",
        });
        console.log(countavaild, "countavaild");
        const updatedBalanceLeaves = result.LeaveCount - result.availd_leave;
        result.balance_leaves = updatedBalanceLeaves;
        await result.save();
      } else if (result.status === "rejected") {
        // No change in the balance leaves if the leave is rejected
      }

      res.status(200).json({
        status: "200",

        message: "Status updated successfully",
        response: result,
      });
    } else {
      res
        .status(404)
        .json({ status: "404", message: "Leave request not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};

// manager leaves List
managerLeave = async (req, res) => {
  try {
    let result = [];
    let matchCondition = { createdBy: new mongoose.Types.ObjectId(req.userID) };
    if (req.query.status) {
      matchCondition.status = req.query.status;
    }
    const resultArray = await leaveModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "employees",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByemp",
        },
      },
      {
        $lookup: {
          from: "admincreateleaves",
          localField: "leaveType",
          foreignField: "_id",
          as: "leavetype",
        },
      },
    ]);

    for (let i = 0; i < resultArray.length; i++) {
      result.push(resultArray[i]);
    }
    lo;

    return res
      .status(200)
      .json({ status: "200", message: "Get Empyee leaves", response: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};

EmployeeLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const userdata = await leaveModel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.userID) } },
      // {
      //   $lookup: {
      //     from: "employees",
      //     localField: "createdBy",
      //     foreignField: "_id",
      //     as: "response",
      //   },
      // },
      {
        $lookup: {
          from: "admincreateleaves",
          localField: "leaveType",
          foreignField: "_id",
          as: "leaveCount",
        },
      },
    ]);
    let resultArray;
    resultArray = await leaveModel.aggregate([
      {
        $match: { createdBy: new ObjectId(req.userID), status: "approved" },
      },
      {
        $lookup: {
          from: "leavetypes",
          localField: "leaveType",
          foreignField: "_id",
          as: "leaveType",
        },
      },
      {
        $group: {
          _id: { leavetype: "$leaveType.leaveType", LeaveCount: "$LeaveCount" },
          availd_leave: { $sum: "$availd_leave" },
        },
      },
      {
        $project: {
          "_id.leavetype": 1,
          availd_leave: 1,
          "_id.LeaveCount": 1,
          balance_leave: { $subtract: ["$_id.LeaveCount", "$availd_leave"] },
        },
      },
    ]);
    return res.status(200).json({
      status: "200",
      message: "Get Employee leaves",
      response: userdata,
    });
  } catch (error) {
    console.log(error.stack);
    res.status(200).json({
      status: "500",
      message: error.message,
      error: error.message,
    });
  }
};
// Api for only employee taken leaves(Manager all leave status
EmployeeTakenLeaves = async (req, res) => {
  try {
    const resultArray = await leaveModel.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByemp",
        },
      },
      {
        $lookup: {
          from: "admincreateleaves",
          localField: "leaveType",
          foreignField: "_id",
          as: "leavetype",
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "createdByemp.designation_id",
          foreignField: "_id",
          as: "designationData",
        },
      },
      {
        $match: {
          "createdByemp.role": 6,
          ...(req.query.status && { status: req.query.status }),
        },
      },
    ]);

    return res
      .status(200)
      .json({ status: "200", message: "Get leaves", response: resultArray });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "500",
      message: error.message,
      // error: error.message,
    });
  }
};

module.exports = {
  EmployeeTakenLeaves,
  managerupdateleavestatus,
  managerLeave,
};
