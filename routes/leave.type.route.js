const leavetypeController = require("../controllers/leave.type.control");
module.exports = function leaveRoute(app) {
  app.post("/RegisterLeave", leavetypeController.leaveRegister);
  app.get("/leavetypes", leavetypeController.leavesList);

    // app.post("/AdminLeaveCount", leavetypeController.adminCount);
  // app.get("/getleavetypes", leavetypeController.getLeavesList);
};

