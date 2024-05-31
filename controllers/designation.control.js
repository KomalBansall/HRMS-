const designationModel = require("../models/designation.model");

// Api for Creating Designation
createDesignation = async (req, res) => {
  let { designation_name, companyId, admin_id } = req.body;
  try {
    const designationname = await designationModel.findOne({
      designation_name: designation_name,
    });
    if (designationname) {
      return res
        .status(200)
        .json({ status: "400", message: "Designation name already exists" });
    }
    const result = await designationModel.create({
      designation_name: designation_name,
      companyId: companyId,
      admin_id: admin_id,
    });
    return res.status(200).json({
      status: "200",
      message: " Designation created successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: "500", message: error.message });
  }
};

// Api for getting the requested single designation available on the db
detailsById = async (req, res) => {
  try {
    const result = await designationModel.findById({ _id: req.params.id });
    res.status(200).json({
      status: "200",
      message: "Designation detail request completed succesfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "400", message: error.message });
  }
};

// Api for update designation

updateDesignation = async (req, res) => {
  try {
    const { designation_name } = req.body;
    const designationId = req.params.id;

    const existingUser = await designationModel.findOne({
      designation_name: designation_name,
      _id: { $ne: designationId },
    });

    if (existingUser) {
      return res
        .status(200)
        .json({ status: "400", message: "Designation already exists" });
    }

    const result = await designationModel.findOneAndUpdate(
      { _id: designationId },
      req.body,
      { new: true }
    );

    res.status(200).json({
      status: "200",
      message: "Designation updated successfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "400", message: error.message });
  }
};

// Api for getting the list of all designations available on db
designationList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const designations = await designationModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalDocuments = await designationModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      status: "200",
      message: "Designation list request completed successfully",
      response: designations,
      metadata: {
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalDocuments: totalDocuments,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "500",
      message: error.message,
      error: error.message,
    });
  }
};

// Api for getting the requested single designation available on the db
detailsById = async (req, res) => {
  try {
    const result = await designationModel.findById({ _id: req.params.id });
    res.status(200).json({
      status: "200",
      message: "Designation detail request completed succesfully",
      response: result,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ status: "400", message: error.message });
  }
};

module.exports = {
  createDesignation,
  updateDesignation,
  designationList,
  detailsById,
};
