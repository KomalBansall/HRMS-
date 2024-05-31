const superAdminModel = require("../models/superadmin.model");
const companyModel = require("../models/company.model");
const AdminModel = require("../models/admin.model");
const employeeModel = require("../models/employee.model");
const hrTeamModel = require("../models/hrTeam.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let SECRET_KEY = "abcdefghigklmiopqrstuvwxyz";

// This Api is for login users

// userLogin = async (req, res) => {
//   try {
//     const superAdminEmail = await superAdminModel.findOne({
//       email: req.body.email,
//     });
//     const companyEmail = await companyModel.findOne({
//       email: req.body.email,
//     });
//     console.log(companyEmail);
//     const hrAdminEmail = await AdminModel.findOne({ email: req.body.email });
//     const hrEmail = await hrTeamModel.findOne({ email: req.body.email });
//     const managerEmail = await employeeModel.findOne({
//       email: req.body.email,
//     });
//     // .populate("department_id designation_id");
//     const employeeEmail = await employeeModel.findOne({
//       email: req.body.email,
//     });
//     // .populate("department_id designation_id");
//     // console.log(employeeEmail);

//     if (superAdminEmail) {
//       // Super Admin Login
//       const token = jwt.sign(
//         {
//           email: superAdminEmail.email,
//           id: superAdminEmail._id,
//         },
//         SECRET_KEY,
//         { expiresIn: "168h" }
//       );
//       msg = "Super Admin";
//       const matchPassword = await bcrypt.compare(
//         req.body.password,
//         superAdminEmail.password
//       );
//       console.log();
//       if (matchPassword && superAdminEmail.status) {
//         return res.status(200).json({
//           status: "200",
//           message: `${msg} Login successfully`,
//           token: token,
//           response: superAdminEmail,
//         });
//       }
//     } else if (companyEmail) {
//       // Compamy Login
//       const token = jwt.sign(
//         {
//           email: companyEmail.email,
//           id: companyEmail._id,
//         },
//         SECRET_KEY,
//         { expiresIn: "168h" }
//       );
//       const matchPassword = await bcrypt.compare(
//         req.body.password,
//         companyEmail.password
//       );
//       if (matchPassword && companyEmail.status) {
//         msg = "Company";
//         return res.status(200).json({
//           status: "200",
//           message: `${msg} Login successfully`,
//           response: companyEmail,
//           token: token,
//         });
//       }
//     } else if (hrAdminEmail) {
//       // HR Admin Login
//       msg = "HrAdmin";
//       const token = jwt.sign(
//         {
//           email: hrAdminEmail.email,
//           id: hrAdminEmail._id,
//         },
//         SECRET_KEY,
//         { expiresIn: "168h" }
//       );
//       const matchPassword = await bcrypt.compare(
//         req.body.password,
//         hrAdminEmail.password
//       );
//       if (matchPassword && hrAdminEmail.status) {
//         msg = "HR admin";
//         return res.status(200).json({
//           status: "200",
//           message: `${msg} Login successfully`,
//           response: hrAdminEmail,
//           token: token,
//         });
//       }
//     } else if (hrEmail) {
//       // Hr Login
//       let msg = "Hr";
//       const token = jwt.sign(
//         {
//           email: hrEmail.email,
//           id: hrEmail._id,
//         },
//         SECRET_KEY,
//         { expiresIn: "168h" }
//       );
//       const matchPassword = await bcrypt.compare(
//         req.body.password,
//         hrEmail.password
//       );
//       if (matchPassword && hrEmail.status) {
//         return res.status(200).json({
//           status: "200",
//           message: `${msg} Login successfully`,
//           response: hrEmail,
//           token: token,
//         });
//       }
//     } else if (managerEmail) {
//       // Manager
//       // console.log(managerEmail);
//       let msg = "Manager";
//       const token = jwt.sign(
//         {
//           email: managerEmail.email,
//           id: managerEmail._id,
//         },
//         SECRET_KEY,
//         { expiresIn: "168h" }
//       );
//       const matchPassword = await bcrypt.compare(
//         req.body.password,
//         managerEmail.password
//       );
//       if (matchPassword && managerEmail.status) {
//         return res.status(200).json({
//           status: "200",
//           message: `${msg} Login successfully`,
//           response: managerEmail,
//           token: token,
//         });
//       }
//     } else if (employeeEmail) {
//       // Employee
//       let msg = "Employee";
//       console.log(employeeEmail);
//       const token = jwt.sign(
//         {
//           email: employeeEmail.email,
//           id: employeeEmail._id,
//         },
//         SECRET_KEY,
//         { expiresIn: "168h" }
//       );
//       const matchPassword = await bcrypt.compare(
//         req.body.password,
//         employeeEmail.password
//       );
//       if (matchPassword && employeeEmail.status) {
//         msg = "Employee";
//         return res.status(200).json({
//           status: "200",
//           message: `${msg} Login successfully`,
//           response: employeeEmail,
//           token: token,
//         });
//       }
//     }
//     // if (existingEmail.status === false) {
//     //   return res
//     //     .status(200)
//     //     .json({ status: "400", message: "User Status Inactive" });
//     // }

//     // if (!matchPassword) {
//     //   return res
//     //     .status(200)
//     //     .json({ status: "400", message: "Invalid Credentials" });
//     // }
//     return res
//       .status(200)
//       .json({ status: "400", message: "Unauthorized User" });
//   } catch (error) {
//     console.log(error);
//     res.status(200).json({
//       status: "400",
//       message: "Invalid Credentials",
//       status: "User Status Inactive",
//     });
//   }
// };

userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let existingUser;
    let msg;
    existingUser = await superAdminModel.findOne({ email });
    msg = "Super Admin";
    if (!existingUser) {
      existingUser = await companyModel.findOne({ email });
      msg = "Company";
    }
    if (!existingUser) {
      existingUser = await AdminModel.findOne({ email });
      msg = "HrAdmin";
    }
    if (!existingUser) {
      existingUser = await hrTeamModel.findOne({ email });
      msg = "hr";
    }
    if (!existingUser) {
      existingUser = await employeeModel
        .findOne({ email })
        .populate("department_id designation_id");
      if (existingUser) {
        if (existingUser.role === 5) {
          msg = "Manager";
        } else if (existingUser.role === 6) {
          msg = "Employee";
        }
      }
    }

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res
        .status(401)
        .json({ status: "401", message: "Invalid credentials" });
    }

    if (existingUser.status === false) {
      return res
        .status(401)
        .json({ status: "401", message: "Unauthorized user" });
    }

    const token = jwt.sign(
      {
        role: existingUser.role,
        email: existingUser.email,
        id: existingUser._id,
        employeeId: existingUser.employeeId,
      },
      SECRET_KEY,
      { expiresIn: "168h" }
    );

    return res.status(200).json({
      status: "200",
      message: `${msg} Login successfully`,
      response: existingUser,
      token: token,
      employeeId: existingUser.employeeId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};

module.exports = { userLogin };
