const mongoose = require("mongoose");
const userModel = mongoose.model(
  "user",
  mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
      },
      employee_id: {
        type: String,
      },
      employee_name: {
        type: String,
      },
      email: {
        type: String,
      },
      role: {
        type: String,
      },
      status: {
        type: Boolean,
      },
      designation: {
        type: String,
      },
      designation_type: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      showPassword: {
        type: String,
      },
      companyName: {
        type: String,
      },
      company_id: {
        type: mongoose.Types.ObjectId,
      },
      logo: {
        type: String,
      },
      address: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      pinCode: {
        type: String,
      },
      contactNo: {
        type: String,
      },
      designation: {
        type: String,
      },
      designation_id: {
        type: mongoose.Types.ObjectId,
      },
      department: {
        type: String,
      },
      department_id: {
        type: mongoose.Types.ObjectId,
      },
      reporting_manager_id: {
        type: mongoose.Types.ObjectId,
      },
      admin_id: {
        type: mongoose.Types.ObjectId,
      },
      hr_id: {
        type: mongoose.Types.ObjectId,
      },
      date_of_joining: {
        type: String,
      },
      date_of_leaving: {
        type: String,
      },
      role: {
        type: String,
      },
      yearly_target: {
        type: String,
      },
    },
    { timestamps: true }
  )
);
module.exports = userModel;
