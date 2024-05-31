const mongoose = require("mongoose");
const leaveModel = mongoose.model(
  "Leave",
  mongoose.Schema(
    {
      admin_id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      manager_id: {
        type: mongoose.Types.ObjectId,
        ref: "Manager",
      },
      hr_id: {
        type: mongoose.Types.ObjectId,
        ref: "Hrteam",
      },
      employee_id: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
      },
      reporting_manager_id: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
      },
      createdBy: {
        type: mongoose.Types.ObjectId,
      },
      leaveType: {
        type: mongoose.Types.ObjectId,
        ref: "LeaveTypes",
        // required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      totalDays: {
        type: String,
      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      LeaveCount: {
        type: Number,
        default:0
      },
      availd_leave: {
        type: Number,
        // required: true,
      },
      balance_leaves: {
        type: Number,
      },
      sum: {
        type: Number,
      },
      admin_Description: {
        type: String,
      },
    },
    { timestamps: true }
  )
);

module.exports = leaveModel;
