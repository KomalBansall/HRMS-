const departmentModel = require("../models/department.model");
// create Department
createDepartment = async (req, res) => {
  let { departmentName, company_id, admin_id } = req.body;
  try {
    const existingDepartment = await departmentModel.findOne({
      departmentName: departmentName,
    });
    if (existingDepartment) {
      return res
        .status(200)
        .json({ status: "400", message: "Department name already exists" });
    }
    const result = await departmentModel.create({
      departmentName: departmentName,
      company_id: company_id,
      admin_id: admin_id,
    });
    return res.status(200).json({
      status: "200",
      message: " Department created successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    create;
    return res
      .status(200)
      .json({ status: "500", message: error.message });
  }
};
// department list with count
departmentList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const departments = await departmentModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalDocuments = await departmentModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      status: "200",
      message: "Department list request completed successfully",
      response: departments,
      metadata: {
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalDocuments: totalDocuments,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "500",
      message: error.message,
      error: error.message,
    });
  }
};

// Department details by id
detailsById = async (req, res) => {
  try {
    const result = await departmentModel.findById({ _id: req.params.id });
    return res.status(200).json({
      status: "200",
      message: "Department detail request completed succesfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: "500", message: error.message });
  }
};

// update Department details
updateDepartmentDetails = async (req, res) => {
  try {
    const { departmentName } = req.body;
    const departmentId = req.params.id;

    const existingUser = await departmentModel.findOne({
      departmentName: departmentName,
      _id: { $ne: departmentId },
    });

    if (existingUser) {
      return res
        .status(200)
        .json({ status: "400", message: "Department name already exists" });
    }

    const result = await departmentModel.findOneAndUpdate(
      { _id: departmentId },
      req.body,
      { new: true }
    );

    res.status(200).json({
      status: "200",
      message: "Department updated successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "400", message:error.message });
  }
};
module.exports = {
  createDepartment,
  updateDepartmentDetails,
  departmentList,
  detailsById,
};
