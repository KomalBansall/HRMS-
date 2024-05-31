const mongoose = require("mongoose");
const leavetypeModel = mongoose.model(
  "LeaveTypes",
  mongoose.Schema(
    {
      leaveType: {
        type: String,
        required: true,
        //   enum: [
        //     "Casual leave",
        //     "Sick leave",
        //     "Short leave",
        //     "Half day",
        //     "Work from home",
        //     "Wedding leave",
        //     "Maternity leave",
        //     "Paternity leave",
        //     // "Statutory leave",
        //     "Birthday leave",
        //     "Anniversary leave",
        //     "Earned leave",
        //   ],
      },
      LeaveCount: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);
module.exports = leavetypeModel;
