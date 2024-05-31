const adminModel = require("../models/superadmin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
SECRET_KEY = "abcdefhijklmnopqrstuvwxyz";

createSuperAdmin = async (req, res) => {
  try {
    let objData = {
      role: 1,
      designation: "SuperAdmin",
      password: req.body.password,
      email: req.body.email,
      password: req.body.password,
      designation: "SuperAdmin",
      status: true,
    };
    const hashedPassword = await bcrypt.hash(objData.password, 10);
    objData.password = hashedPassword;
    const existingUser = await adminModel.findOne({ email: objData.email });
    if (existingUser) {
      return res
        .status(200)
        .json({ status: "400", message: "email already exist" });
    }
    const result = await adminModel.create(objData);
    res.status(200).json({
      status: "200",
      message: "Super Admin created successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};
module.exports = { createSuperAdmin };
