const mongoose = require("mongoose");
const hrModel = require("../models/hrTeam.model");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const hrTeamModel = require("../models/hrTeam.model");
const leaveModel = require("../models/leave.model");
SECRET_KEY = "abcdefghigklmiopqrstuvwxyz";

// This Api is for registering the HR
hrRegister = async (req, res) => {
  try {
    hrData = {
      employeeId: req.body.employeeId,
      employeeName: req.body.employeeName,
      password: req.body.password,
      role: 4,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pinCode: req.body.pinCode,
      contactNo: req.body.contactNo,
      date_of_joining: req.body.date_of_joining,
      company_id: req.body.company_id,
      admin_id: req.userID,
      designation: "Hr",
      department_id: req.body.department_id,
      reporting_manager_id: req.body.reporting_manager_id,
      reason_of_leaving: req.body.reason_of_leaving,
      status: true,
    };
    const existingId = await hrModel.findOne({ employeeId: hrData.employeeId });
    if (existingId) {
      return res
        .status(200)
        .json({ status: "400", Message: "Employee ID already exists" });
    }
    const existingEmail = await hrModel.findOne({ email: hrData.email });
    if (existingEmail) {
      return res
        .status(200)
        .json({ status: "400", Message: "email already exists" });
    }
    const hashedPassword = await bcrypt.hash(hrData.password, 10);
    hrData.password = hashedPassword;
    const result = await hrModel.create(hrData);
    res.status(200).json({
      status: "200",
      message: "HR created successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "500", Message: error.message });
  }
};
// Get All HR List
// getHr = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 30;
//     const skip = (page - 1) * limit;
//     const totalCount = await hrModel.countDocuments();
//     const totalPages = Math.ceil(totalCount / 8);
//     const data = await hrModel
//       .find()
//       .populate("company_id department_id reporting_manager_id")
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({
//       status: "200",
//       message: "HR list request completed successfully",
//       response: data,
//       meta: { limit, page, totalCount, totalPages },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "500", message: error.message });
//   }
// };

getHr = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const totalCount = await hrModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const data = await hrModel
      .find()
      .populate("company_id department_id reporting_manager_id")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "200",
      message: "HR list request completed successfully",
      response: data,
      meta: { currentPage: page, totalPages: totalPages, totalCount, limit },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};


// Get single hr details-
getHrById = async (req, res) => {
  try {
    const data = await hrModel
      .findById({ _id: req.params.id })
      .populate("company_id designation_id department_id");
    res.status(200).json({
      status: "200",
      response: data,
      message: "Get single hr details",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "500", message: error.message });
  }
};

// HR Update Api_
HrUpdate = async (req, res) => {
  try {
    const hrId = req.params.id;
    const emailExist = await hrModel.findOne({
      email: req.body.email,
      _id: { $ne: hrId },
    });

    if (emailExist) {
      return res
        .status(400)
        .json({ status: "400", message: "Email already exists" });
    }
    if (req.body.password) {
      const newHashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = newHashedPassword;
    }
    const result = await hrModel.findOneAndUpdate({ _id: hrId }, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: "200",
      message: "Updated successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "400", message: error.message });
  }
};

HrStatusUpdate = async (req, res) => {
  try {
    const result = await hrModel.findByIdAndUpdate(
      { _id: req.body._id },
      { status: req.body.status }
    );
    console.log(result);
    res
      .status(200)
      .json({ status: "200", message: "HR status update successfully" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "500", message: error.message });
  }
};

// Employee and manager Leave status
hrAllLeaves = async (req, res) => {
  try {
    let result = [];
    if (req.query.status) {
      const resultArray = await leaveModel.aggregate([
        {
          $match: {
            hr_id: new mongoose.Types.ObjectId(req.userID),
            status: req.query.status,
          },
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
            $or: [{ "createdByemp.role": 5 }, { "createdByemp.role": 6 }],
          },
        },
      ]);
      for (let i = 0; i < resultArray.length; i++) {
        result.push(resultArray[i]);
      }

      return res
        .status(200)
        .json({ status: "200", message: "Get leaves", response: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};

// hr leaves list
hrLeaves = async (req, res) => {
  try {
    let result = [];
    {
      const resultArray = await leaveModel.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(req.userID),
          },
        },
        // {
        //   $lookup: {
        //     from: "hrteams",
        //     localField: "createdBy",
        //     foreignField: "_id",
        //     as: "createdByhr",
        //   },
        // },
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
      return res
        .status(200)
        .json({ status: "200", message: "Get HR leaves", response5: result });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "500", message: error.message });
  }
};

module.exports = {
  hrRegister,
  getHr,
  getHrById,
  HrUpdate,
  HrStatusUpdate,
  hrAllLeaves,
  hrLeaves,
};
