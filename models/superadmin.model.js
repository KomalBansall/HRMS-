const mongoose = require("mongoose");
const superadmin = mongoose.model(
  "SuperAdmin",
  mongoose.Schema(
    {
      role: {
        type: Number,
      },
      designation: {
        type: String,
      },
      password: {
        type: String,
      },
      email: {
        type: String,
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
module.exports = superadmin;
