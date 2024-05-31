const companyModel = require("../models/company.model");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
SECRET_KEY = "abcdefghijklmnopqrstuvwxyz";

// Api for creating Companies
createCompany = async (req, res) => {
  try {
    let path = `../uploads/companylogo/${req.file.originalname}`;

    let objData = {
      role: 2,
      password: req.body.password,
      companyName: req.body.companyName,
      email: req.body.email,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      pinCode: req.body.pinCode,
      contactNo: req.body.contactNo,
      logo: path,
      status: true,
    };
    const hashedPassword = await bcrypt.hash(objData.password, 10);
    console.log(hashedPassword);
    objData.password = hashedPassword;
    const existingEmail = await companyModel.findOne({
      email: objData.email,
    });
    if (existingEmail) {
      return res
        .status(200)
        .json({ status: "400", message: "Email already exist" });
    }
    const result = await companyModel.create(objData);
    // const result = await
    res.status(200).json({
      status: "200",
      message: "Company created successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "500", message: error.message });
  }
};

// Api for getting all companies list and their count available on db
getCompaniesCount = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const [result, counts] = await Promise.all([
      companyModel.find().skip(skip).limit(limit),
      companyModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(counts / limit);
    res.status(200).json({
      status: "200",
      message: "Companies list request completed successfully",
      response: result,
      meta: { page, limit, totalCompanies: counts, totalPages },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "400", message: error.message });
  }
};

// Api for getting the requested Single company details available on db
// detailsById = async (req, res) => {
//   let id = req.params.id;
//   try {
//     const result = await companyModel.findById({ _id: id });
//     res.status(200).json({
//       status: "200",
//       message: "Companies details request completed successfully",
//       response: result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(200).json({ status: "400", message: "something went wrong" });
//   }
// };

details = async (req, res) => {
  let id = req.params.id;
  try {
    const result = await companyModel.findById(id);
    if (result) {
      res.status(200).json({
        status: 200,
        message: "Company details request completed successfully",
        response: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Company not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Api for update company feilds

companyUpdate = async (req, res) => {
  try {
    const companyId = req.params.id;
    const emailExist = await companyModel.findOne({
      email: req.body.email,
      _id: { $ne: companyId },
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

    const result = await companyModel.findOneAndUpdate(
      { _id: companyId },
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

//  company status update Api
updateStatus = async (req, res) => {
  try {
    const result = await companyModel.findByIdAndUpdate(
      { _id: req.body._id },
      { status: req.body.status }
    );
    console.log(result);
    res.status(200).json({
      status: "200",
      message: "Company status update successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "500", message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompaniesCount,
  details,
  companyUpdate,
  updateStatus,
};

companyUpdate = async (req, res) => {
  try {
    const { email } = req.body;
    const companyId = req.params.id;

    const existingEmail = await companyModel.findOne({
      email: email,
      _id: { $ne: companyId },
    });

    if (existingEmail) {
      return res

        .status(200)
        .json({ status: "400", message: "email already exists" });
    }

    const result = await companyModel.findOneAndUpdate(
      { _id: companyId },
      req.body,
      { new: true }
    );

    res.status(200).json({
      status: "200",
      message: "Company updated successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "400", message: "Something went wrong" });
  }
};
