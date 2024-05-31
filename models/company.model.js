const mongoose = require("mongoose");

const companySchema = mongoose.model(
  "Company",
  mongoose.Schema(
    {
      password: {
        type: String,
      },
      companyName: {
        type: String,
      },
      email: {
        type: String,
      },
      logo: {
        type: String,
      },
      role: {
        type: Number,
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
        type: Number,
      },
      status: {
        type: Boolean,
      },
      logo:{
        type: String
      }
    },
    {
      timestamps: true,
    }
  )
);
module.exports = companySchema;
