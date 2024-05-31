const hrController = require("../controllers/hrTeam.controller");
const superadminController = require("../controllers/superadmin.control");
const admincontroller = require("../controllers/admin.control");
const empcontroller = require("../controllers/employee.control");
const logincontroller = require("../controllers/login.control");
const managercontroller = require("../controllers/manager.control");
const uploads = require("../multer/employeedoc.multer");
const { verifyToken } = require("../middleware/verifyToken");
const express = require("express");
const { verify } = require("jsonwebtoken");

module.exports = function userRoutes(app) {
  // this route for LoginUser
  app.post("/login", logincontroller.userLogin);

  // Api for creating Super Admin
  app.post("/createsuperadmin", superadminController.createSuperAdmin);

  // Api for creating Admin
  app.post("/createadmin", verifyToken, admincontroller.createAdmin);
  app.get("/adminlist", verifyToken, admincontroller.adminList);
  app.get("/admindetails/:id", verifyToken, admincontroller.detailsById);
  app.put("/updateadmin/:id", verifyToken, admincontroller.updateAdmin);
  app.put("/statusupdate", verifyToken, admincontroller.adminStatusUpdate);
  app.put(
    "/updateleavestatus/:id/:status",
    verifyToken,
    admincontroller.updateLeaveStatus
  );

  // Api for creating HR
  app.post("/hrCreate", verifyToken, hrController.hrRegister);
  app.get("/getHr", verifyToken, hrController.getHr);
  app.get("/getHrById/:id", verifyToken, hrController.getHrById);
  app.put("/updatehr/:id", verifyToken, hrController.HrUpdate);
  app.put("/hrstatusupdate", verifyToken, hrController.HrStatusUpdate);
  app.get("/hrallleavestatus", verifyToken, hrController.hrAllLeaves);
  app.get("/hrleavelist", verifyToken, hrController.hrLeaves);

  // Api for creating Employee
  app.post("/createEmployee",verifyToken,uploads.array("document"),empcontroller.employeeRegister);
  app.get("/getEmployee", verifyToken, empcontroller.getEmployee);
  app.get("/getManager", verifyToken, empcontroller.getManager);
  app.get("/getEmployeeById/:id", verifyToken, empcontroller.getEmployeeById);
  app.put("/empupdate/:id", verifyToken, empcontroller.EmpUpdate);
  app.put("/empstatusupdate", verifyToken, empcontroller.EmpStatusUpdate);
  app.get("/employeeleaves", verifyToken, empcontroller.EmployeeLeaves);
  app.get("/employessdata", empcontroller.csvDownload);

  //    Api for getting Reporting Manager
  app.get(
    "/getreportingmanager",
    verifyToken,
    empcontroller.getreportingManager
  );

  // Manager's Leave Api
  app.get("/managerleave", verifyToken, managercontroller.managerLeave);
  app.put(
    "/updateleave/:id/:status",
    verifyToken,
    managercontroller.managerupdateleavestatus
  );
  app.get(
    "/managerallleavestatus",
    verifyToken,
    managercontroller.EmployeeTakenLeaves
  );

    app.get("/ReportingManagerAdmins",verifyToken,admincontroller.ReportingManagerAdmins)
};



