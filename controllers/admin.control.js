const adminModel = require("../models/admin.model");
const leaveModel = require("../models/leave.model");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

// Create Admin
createAdmin = async (req, res) => {
  try {
    let objData = {
      email: req.body.email,
      role: 3,
      phone_number: req.body.phone_number,
      designation: "HrAdmin",
      employeeName: req.body.employeeName,
      password: req.body.password,
      company_id: req.userID,
      status: true,
    };
    const hashedPassword = await bcrypt.hash(objData.password, 10);
    objData.password = hashedPassword;

    const existingEmail = await adminModel.findOne({
      email: objData.email,
    });
    if (existingEmail) {
      return res
        .status(200)
        .json({ status: "400", Message: "Email already exists" });
    }

    const result = await adminModel.create(objData);
    res.status(200).json({
      status: "200",
      Message: "Admin created successfully",
      response: result,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "400", Message: error.message });
  }
};

// Admin List
adminList = async (req, res) => {
  try {
    const loggedInCompanyId = new mongoose.Types.ObjectId(req.userID);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const aggregationPipeline = [
      {
        $match: {
          company_id: loggedInCompanyId,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [
      {
        $match: {
          company_id: loggedInCompanyId,
        },
      },
      {
        $count: "totalCount",
      },
    ];

    const [countResult, resultArray] = await Promise.all([
      adminModel.aggregate(countPipeline),
      adminModel.aggregate(aggregationPipeline),
    ]);

    const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      status: "200",
      message: "admins",
      response: resultArray,
      meta: {
        page,
        limit,
        totalAdmins: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "400",
      message: "Something went wrong",
    });
  }
};

// Admin  Details Bt Id
detailsById = async (req, res) => {
  let id = req.params.id;
  try {
    const result = await adminModel.findById({ _id: id });
    res.status(200).json({
      status: "200",
      message: "Admin details shown succesfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "400", Message: error.message });
  }
};

// Admin details Update Api
updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const emailExist = await adminModel.findOne({
      email: req.body.email,
      _id: { $ne: adminId },
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

    const result = await adminModel.findOneAndUpdate(
      { _id: adminId },
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

// Admin Status Update
adminStatusUpdate = async (req, res) => {
  try {
    const admin = await adminModel.findByIdAndUpdate(
      { _id: req.body._id },
      { status: req.body.status }
    );
    if (!admin) {
      return res
        .status(404)
        .json({ status: "400", message: "Admin not found" });
    }
    const result = await adminModel.findByIdAndUpdate(
      { _id: req.body._id },
      { status: req.body.status }
    );
    console.log(result);
    res
      .status(200)
      .json({ status: "200", message: "Admin status update successfully" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "400", message: error.message });
  }
};

// Api for update leave status
updateLeaveStatus = async (req, res) => {
  try {
    const objData = {
      opening_balance: 7,
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
          leaveType: result.leaveType,
          status: "approved",
          createdBy: result.createdBy,
        });
        let sum1 = 0;
        for (let i = 0; i < countavaild.length; i++) {
          sum1 += countavaild[i].availd_leave;
        }
        const updatedBalanceLeaves =
          result.opening_balance - result.availd_leave;
        result.balance_leaves = updatedBalanceLeaves;
        await leaveModel.updateMany(
          {
            createdBy: result.createdBy,
            status: "approved",
            leaveType: result.leaveType,
          },
          { $set: { sum: sum1 } },
          { new: true }
        );
        await result.save();
      }
      if (req.params.status === "reject") {
        await leaveModel.findByIdAndUpdate(
          { _id: req.params.id },
          { admin_Description: req.body.admin_Description },
          { new: true }
        );
      }
      res.status(200).json({
        status: "200",
        Message: "Status updated successfully",
        updatedResult: result,
      });
    } else {
      res
        .status(404)
        .json({ status: "200", Message: "Leave request not found" });
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ status: "400", Response: error.message });
  }
};

const ReportingManagerAdmins = async (req, res) => {
  try {
    const loggedInAdminId = new mongoose.Types.ObjectId(req.userID);
    
    console.log('loggedInAdminId',loggedInAdminId);
    const getAdminDeatils= await adminModel.findById({_id:loggedInAdminId})
    console.log('getAdminDeatils',getAdminDeatils.company_id);
    const aggregationPipeline = [
      {
        $match: {
          company_id: { $eq: getAdminDeatils.company_id },
          
        },
      },
      {
        $project: {
          _id: 1,
          employeeName:1,
          email: 1,
          // company_id:1,
        },
      },
    ];

    const resultArray = await adminModel.aggregate(aggregationPipeline);

    res.status(200).json({
      status: "200",
      message: "admins",
      response: resultArray,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "500",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createAdmin,
  adminList,
  detailsById,
  detailsById,
  updateAdmin,
  adminStatusUpdate,
  updateLeaveStatus,
  ReportingManagerAdmins,
};
