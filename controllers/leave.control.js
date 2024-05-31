const mongoose = require("mongoose");
const leaveModel = require("../models/leave.model");
const leavetypeModel = require("../models/leave.type.model");
// const adminleavecount = require("../models/adminleavecount.model");
// Api for Creating leave
createLeave = async (req, res) => {
  try {
    // console.log(req.role, "=============================");
    // console.log(req.userID, "=============================");
    // console.log(req.employeeId, "===========================");
    let objData = {
      admin_id: req.body.admin_id,
      employeeId: req.employeeId,
      manager_id: req.body.manager_id,
      hr_id: req.body.hr_id,
      employee_id: req.body.employee_id,
      reporting_manager_id: req.body.reporting_manager_id,
      role: req.role,
      createdBy: req.userID,
      leaveType: req.body.leaveType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalDays: 0,
      description: req.body.description,
      status: "pending",
    };

    console.log(objData.leaveType);
    const adminCreatedLeave = await adminleavecount.findById({
      _id: objData.leaveType,
    });
    // console.log(adminCreatedLeave);
    const leaveTypes = await leavetypeModel.findOne({
      _id: objData.leaveType,
    });
    // Short Leave
    console.log(adminCreatedLeave);
    if (adminCreatedLeave.LeaveCount === "2 Hours") {
      const saveLeave = await leaveModel.create({
        ...objData,
        totalDays: adminCreatedLeave.LeaveCount,
      });
      res.status(200).json({
        status: "200",
        message: "Leave created successfully",
        response: saveLeave,
      });
      //   // Half Day Leave
    } else if (adminCreatedLeave.LeaveCount === "4.5 Hours must completed") {
      const saveLeave = await leaveModel.create({
        ...objData,
        totalDays: "4.5 hrs",
      });
      res.status(200).json({
        status: "200",
        message: "Leave created successfully",
        response: saveLeave,
      });

      // Rest of the leaves
      // } else {
      //   const result = await hrleavecount.create({
      //     ...objData,
      //     totalDays: "1",
      //     LeaveCount :
      // });
    } else {
      const result = await leaveModel.create({
        ...objData,
        totalDays: "1",
        LeaveCount: adminCreatedLeave.LeaveCount,
      });
      res.status(200).json({
        status: "200",
        message: " Leave created successfully",
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

// get Assigned leaves
getAssignedLeaves = async (req, res) => {
  try {
    let result = [];
    if (req.query.status) {
      const resultArray = await leaveModel.aggregate([
        {
          $match: {
            $or: [
              {
                hr_id: new mongoose.Types.ObjectId(req.userID),
                status: req.query.status,
              },
              {
                manager_id: new mongoose.Types.ObjectId(req.userID),
                status: req.query.status,
              },
              {
                employee_id: new mongoose.Types.ObjectId(req.userID),
                status: req.query.status,
              },
            ],
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByEmp",
          },
        },
        {
          $lookup: {
            from: "managers",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByManager",
          },
        },
        {
          $lookup: {
            from: "hrteams",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByhr",
          },
        },
        {
          $lookup: {
            from: "managers",
            localField: "manager_id",
            foreignField: "_id",
            as: "managerData",
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "employee_id",
            foreignField: "_id",
            as: "employeeData",
          },
        },
        {
          $lookup: {
            from: "hrteams",
            localField: "hr_id",
            foreignField: "_id",
            as: "hrData",
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
      return res
        .status(200)
        .json({ status: "200", message: "Get leaves", response: result });
    } else {
      const resultArray = await leaveModel.aggregate([
        {
          $match: {
            $or: [
              {
                hr_id: new mongoose.Types.ObjectId(req.userID),
              },
              {
                manager_id: new mongoose.Types.ObjectId(req.userID),
              },
              {
                employee_id: new mongoose.Types.ObjectId(req.userID),
              },
            ],
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByEmp",
          },
        },
        {
          $lookup: {
            from: "managers",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByManager",
          },
        },
        {
          $lookup: {
            from: "managers",
            localField: "manager_id",
            foreignField: "_id",
            as: "managerData",
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "employee_id",
            foreignField: "_id",
            as: "employeeData",
          },
        },
        {
          $lookup: {
            from: "hrteams",
            localField: "hr_id",
            foreignField: "_id",
            as: "hrData",
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
      return res
        .status(200)
        .json({ status: "200", message: "Get leaves", response: result });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "500",
      message: error.message,
    });
  }
};

// get Admin status updated leaves
getLeave = async (req, res) => {
  try {
    let result = [];
    console.log("first");
    if (req.query.status) {
      const resultArray = await leaveModel.aggregate([
        {
          $match: {
            admin_id: new mongoose.Types.ObjectId(req.userID),
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
            from: "hrteams",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdByhr",
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
        {
          $lookup: {
            from: "designations",
            localField: "createdByemp.designation_id",
            foreignField: "_id",
            as: "Designation",
          },
        },
        {
          $lookup: {
            from: "designations",
            localField: "createdByhr.designation_id",
            foreignField: "_id",
            as: "hrDesignation",
          },
        },
      ]);
      for (let i = 0; i < resultArray.length; i++) {
        result.push(resultArray[i]);
      }
      console.log(resultArray);
      return res
        .status(200)
        .json({ status: "200", message: "Get leaves", response: result });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "500",
      message: error.message,
    });
  }
};

// getLeave = async (req, res) => {
//   try {
//     let result = [];
//     if (req.query.status) {
//       // console.log("first")
//       console.log(req.query)
//       console.log(req.userID)
//       const resultArray = await leaveModel.aggregate([
//         {
//           $match: {
//             admin_id: new mongoose.Types.ObjectId(req.userID),
//             status: req.query.status,
//           },
//         },
//         {
//           $lookup: {
//             from: "employees",
//             localField: "createdBy",
//             foreignField: "_id",
//             as: "createdByemp",
//           },
//         },
//         {
//           $lookup: {
//             from: "hrteams",
//             localField: "createdBy",
//             foreignField: "_id",
//             as: "createdByhr",
//           },
//         },
//         {
//           $lookup: {
//             from: "leavetypes",
//             localField: "leaveType",
//             foreignField: "_id",
//             as: "leavetype",
//           },
//         },
//         {
//           $lookup: {
//             from: "designations",
//             localField: "createdByemp.designation_id",
//             foreignField: "_id",
//             as: "Designation",
//           },
//         },
//         {
//           $lookup: {
//             from: "designations",
//             localField: "createdByhr.designation_id",
//             foreignField: "_id",
//             as: "hrDesignation",
//           },
//         },
//       ]);
//       for (let i = 0; i < resultArray.length; i++) {
//         result.push(resultArray[i]);
//       }
//       console.log(resultArray)
//       return res
//         .status(200)
//         .json({ status: "200", message: "Get leaves", data: result });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(200).json({
//       status: "500",
//       message: error.message,
//     });
//   }
// };

// Api for getting leaves according to date
leaveAcctoStatus = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const status = req.query.status;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    if (status && status !== "all") {
      query.status = status;
    }
    const result = await leaveModel.find(query);

    if (result.length > 0) {
      res.status(200).json({
        status: 200,
        message: "Leave search completed successfully",
        response: result,
      });
    } else {
      res.status(200).json({ status: 200, message: "No leaves found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 400, message: error.message });
  }
};

module.exports = {
  createLeave,
  getAssignedLeaves,
  getLeave,
  leaveAcctoStatus,
};
