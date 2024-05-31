const leaveController = require("../controllers/leave.control");
const { verifyToken } = require("../middleware/verifyToken");

module.exports = function leaveRoute(app) {
  app.post("/createleave", verifyToken, leaveController.createLeave);

  /// admin
  app.get("/adminallleavestatus", verifyToken, leaveController.getLeave);
  // getTakenLeaves
  app.get("/getAssignedLeave", verifyToken, leaveController.getAssignedLeaves);

  // get leave acc. to date
  // app.get('/leaveacctostatus', verifyToken, leaveController.leaveAcctoStatus);
};
