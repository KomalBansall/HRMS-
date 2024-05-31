const mongoose = require("mongoose");
const hrTeamModel = mongoose.model(
  "Hrteam",
  mongoose.Schema(
    {
      employeeId: {
        type: String,
      },
      employeeName: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: Number,
      },
      email: {
        type: String,
      },
      status: {
        type: Boolean,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pinCode: {
        type: String,
      },
      contactNo: {
        type: Number,
      },
      date_of_joining: {
        type: String,
      },
      date_of_leaving: {
        type: String,
      },
      company_id: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
      },
      admin_id: {
        type: mongoose.Types.ObjectId,
      },
      designation: {
        type: String,
        // type: mongoose.Types.ObjectId,
        // ref : 'Designation'
      },
      department_id: {
        type: mongoose.Types.ObjectId,
        ref: "Department",
      },
      reporting_manager_id: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
      },
    },
    { timestamps: true }
  )
);
module.exports = hrTeamModel;
