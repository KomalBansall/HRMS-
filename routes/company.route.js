const companyController = require("../controllers/company.control");
const { verifyToken } = require("../middleware/verifyToken");
const uploads = require("../multer/companylogo.multer");


// const upload = require("../multer/company.multer");

module.exports = function companyRoute(app) {
  app.post("/createCompanies", verifyToken, uploads.single('logo'),companyController.createCompany);
  // app.put('/updateCompany/:id', upload.single('logo'), companyController.updateCompanyDetails);
  // app.put('/updateCompany/:id',companyController.companyUpdate)
  app.put("/updateCompany/:id", verifyToken, companyController.companyUpdate);
  app.get(
    "/getCompaniesListAndCount",
    verifyToken,
    companyController.getCompaniesCount
  );
  app.get("/getDetailCompany/:id", verifyToken, companyController.details);
  app.put("/companystatusupdate", verifyToken, companyController.updateStatus);
};
