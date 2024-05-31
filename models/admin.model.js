const { uniqueId } = require("lodash");
const mongoose = require("mongoose");
const admin = mongoose.model(
  "Admin",
  mongoose.Schema(
    {
      email: {
        type: String,
      },
      phone_number: {
        type: Number,
      },
      role: {
        type: Number,
      },
      employeeName: {
        type: String,
      },
      designation: {
        type: String,
      },
      password: {
        type: String,
      },
      showpassword: {
        type: String,
      },
      company_id: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
      },
      status: {
        type: Boolean,
      },
    },
    {
      timestamps: true,
    }
  )
);
module.exports = admin;
