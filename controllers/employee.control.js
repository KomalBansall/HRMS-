const employeeModel = require("../models/employee.model");
const designationModel = require("../models/designation.model");
const bcrypt = require("bcrypt");
const hrTeamModel = require("../models/hrTeam.model");
const leaveModel = require("../models/leave.model");
const adminModel = require("../models/admin.model");
const adminleavecount = require("../models/adminleavecount.model");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Parser } = require("json2csv");
const path = require("path");
const fs = require("fs");

// // This Api is for registering the Employee
employeeRegister = async (req, res) => {
  // try {

  //   let path = `../uploads/employeedoc/${req.file.originalname}`;
  //   const employeeData = {
  try {
    const files = req.files;
    const documents = [];

    // Process each uploaded file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join("/uploads/employeedoc", file.filename);

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        // If it's a non-image file, push the file path directly to the documents array
        documents.push(filePath);
      } else {
        // Delete image files (if you don't want to save them)
        fs.unlinkSync(file.path);
      }
    }

    const employeeData = {
      employeeId: req.body.employeeId,
      employeeName: req.body.employeeName,
      password: req.body.password,
      role: 6,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pinCode: req.body.pincode,
      contactNo: req.body.contactNo,
      date_of_joining: req.body.date_of_joining,
      document: req.body.document,
      company_id: req.body.company_id,
      admin_id: req.body.admin_id,
      hr_id: req.userID,
      designation_id: req.body.designation_id,
      department_id: req.body.department_id,
      reporting_manager_id: req.body.reporting_manager_id,
      status: true,
      documents: documents,
    };
    const existingId = await employeeModel.findOne({
      employeeId: employeeData.employeeId,
    });
    if (existingId) {
      return res
        .status(200)
        .json({ status: "400", message: "Employee ID already exists" });
    }
    const existingEmail = await employeeModel
      .findOne({ email: employeeData.email })
      .populate("company_id designation_id department_id");
    if (existingEmail) {
      return res
        .status(200)
        .json({ status: "400", message: "Email already exists" });
    }
    const designationData = await designationModel.findOne({
      _id: employeeData.designation_id,
    });
    if (designationData.designation_name === "manager") {
      employeeData.role = 5;
    }
    const hashedPassword = await bcrypt.hash(employeeData.password, 10);
    employeeData.password = hashedPassword;
    const result = await employeeModel.create(employeeData);

    return res.status(200).json({
      status: "200",
      message: "User created successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ status: "500", message: error.message });
  }
};
// const files = req.files;
// const documents = [];
// for (let i = 0; i < files.length; i++) {
//   const file = files[i];
//   const filePath = path.join("/uploads/employeedoc", file.filename);
//   if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
//     documents.push(filePath);
//   } else {
//     fs.unlinkSync(file.path);
//   }

getManager = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const countManager = await employeeModel.countDocuments({ role: 5 });
    console.log(countManager);
    const totalPages = Math.ceil(countManager / 8);
    // console.log(totalPages);
    const data = await employeeModel.aggregate([
      { $match: { role: 5 } },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "designation_id",
          foreignField: "_id",
          as: "designation",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "department_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $lookup: {
          from: "hrteams",
          localField: "reporting_manager_id",
          foreignField: "_id",
          as: "hr_reporting",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "reporting_manager_id",
          foreignField: "_id",
          as: "Admin_reporting",
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    return res.status(200).json({
      status: "200",
      response: data,
      message: "Get all employees",
      meta: {
        page,
        limit,
        totalManagers: countManager,
        totalPages,
      },
    });
  } catch (error) {
    console.log("errr", error);
    return res.status(500).json({ status: "500", message: error.message });
  }
};

getEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const countEmp = await employeeModel.countDocuments({ role: 6 });
    // console.log(countEmp);
    const totalPages = Math.ceil(countEmp / 8);
    console.log(totalPages);
    const data = await employeeModel.aggregate([
      { $match: { role: 6 } },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      
      {
        $lookup: {
          from: "designations",
          localField: "designation_id",
          foreignField: "_id",
          as: "designation",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "department_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $lookup: {
          from: "hrteams",
          localField: "reporting_manager_id",
          foreignField: "_id",
          as: "hr_reporting",
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "reporting_manager_id",
          foreignField: "_id",
          as: "Manager_reporting",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "reporting_manager_id",
          foreignField: "_id",
          as: "Admin_reporting",
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    // console.log(limit, skip);
    return res.status(200).json({
      status: "200",
      response: data,
      message: "Get all employees",
      meta: {
        page,
        limit,
        totalEmployees: countEmp,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "500", message: error.message });
  }
};

// Get single employee details
getEmployeeById = async (req, res) => {
  try {
    const data = await employeeModel
      .findById({ _id: req.params.id })
      .populate("company_id designation_id department_id");
    return res.status(200).json({
      status: "200",
      response: data,
      message: "Get single employee details",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ status: "500", message: error.message });
  }
};

// Employee details update
EmpUpdate = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const emailExist = await employeeModel.findOne({
      email: req.body.email,
      _id: { $ne: employeeId },
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

    const result = await employeeModel.findOneAndUpdate(
      { _id: employeeId },
      req.body,
      { new: true }
    );
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

// Employee Status Update
EmpStatusUpdate = async (req, res) => {
  try {
    const result = await employeeModel.findByIdAndUpdate(
      { _id: req.body._id },
      { status: req.body.status }
    );
    console.log(result);
    return res.status(200).json({
      status: "200",
      message: "Employee status update successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ status: "500", message: error.message });
  }
};

// getreportingManager = async (req, res) => {
//   try {
//     const adminData = await adminModel.find({ role: 3 });
//     const hrData = await hrTeamModel
//       .find({ role: 4 })
//       .populate("designation_id");
//     const managerData = await employeeModel
//       .find({ role: 5 })
//       .populate("designation_id");
//     const employeeData = await employeeModel
//       .find({ role: 6 })
//       .populate("reporting_manager_id designation_id");

//     const data = [
//       ...adminData,
//       ...hrData,
//       ...managerData,
//       // ...employeeData
//     ];

//     return res.status(200).json({
//       status: "200",
//       message: "Reporting Manager Found Successfully",
//       response: data,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: "500", message: error.message });
//   }
// };

getreportingManager = async (req, res) => {
  try {
    const hrData = await hrTeamModel
      .find({ role: 4 })
      .populate('reporting_manager_id');
    const managerData = await employeeModel
      .find({ role: 5 })
      .populate('designation_id reporting_manager_id');
    const employeeData = await employeeModel.find({ role: 6 }).populate('reporting_manager_id designation_id');

    const data = [
      ...hrData,
      ...managerData,
      ...employeeData
    ];

    return res
      .status(200)
      .json({
        status: "200",
        message: "Reporting Manager Found Successfully",
        Response: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "500", message: "Something went wrong" });
  }
};

// // Employee leaves
EmployeeLeaves = async (req, res) => {
  try {
    let result = [];
    {
      const resultArray = await leaveModel.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(req.userID),
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
            from: "leavetypes",
            localField: "leaveType",
            foreignField: "_id",
            as: "leavetype",
          },
        },
      ]);
      for (let i = 0; i < resultArray.length; i++) {
        result.push(resultArray[i]);
      }
      return res.status(200).json({
        status: "200",
        message: "Get Employee leaves",
        response: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "500",
      message: error.message,
    });
  }
};

// Employee leaves
// EmployeeLeaves = async (req, res) => {
//   try {
//     const { status } = req.query;
//     console.log(req.userID, "req.userID");
//     const userdata = await leaveModel.aggregate([
//       { $match: { createdBy: new mongoose.Types.ObjectId(req.userID) } },
//       {
//         $lookup: {
//           from: "employees",
//           localField: "createdBy",
//           foreignField: "_id",
//           as: "response",
//         },
//       },
//     ]);
//     let resultArray;
//     resultArray = await leaveModel.aggregate([
//       {
//         $match: { createdBy: new ObjectId(req.userID), status: "approved" },
//       },
//       {
//         $lookup: {
//           from: "leavetypes",
//           localField: "leaveType",
//           foreignField: "_id",
//           as: "leaveType",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             leavetype: "$leaveType.leaveType",
//             LeaveCount: "$LeaveCount",
//           },
//           availd_leave: { $sum: "$availd_leave" },
//         },
//       },
//       {
//         $project: {
//           "_id.leavetype": 1,
//           availd_leave: 1,
//           "_id.LeaveCount": 1,
//           balance_leave: {
//             $subtract: ["$_id.LeaveCount", "$availd_leave"],
//           },
//         },
//       },
//     ]);
//     return res.status(200).json({
//       status: "200",
//       message: "Get Employee leaves",
//       data: resultArray,
//       userdata: userdata,
//     });
//   } catch (error) {
//     console.log(error.stack);
//     res.status(200).json({
//       status: "500",
//       message: error.message,
//       erroe: error.message,
//     });
//   }
// };

// APi for download Csvv
// const { Parser } = require("json2csv");

const csvDownload = async (req, res) => {
  try {
    const EmployeeData = await adminleavecount.find();
    const fieldNames = Array.from(
      EmployeeData.reduce(
        (accumulator, document) =>
          new Set([...accumulator, ...Object.keys(document._doc)]),
        new Set()
      )
    );
    const json2csvParser = new Parser({ fields: fieldNames });
    const csvData = json2csvParser.parse(EmployeeData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=EmployeeData.csv"
    );
    res.status(200).send(csvData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "400", message: error.message });
  }
};

module.exports = {
  employeeRegister,
  getEmployee,
  getEmployeeById,
  EmpStatusUpdate,
  EmpUpdate,
  getManager,
  getreportingManager,
  EmployeeLeaves,
  csvDownload,
};
