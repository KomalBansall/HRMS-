const mongoose = require('mongoose');
const department = mongoose.model(
    'Department', mongoose.Schema({
        departmentName: {
            type: String
        },
        company_id: {
            type: mongoose.Types.ObjectId,
            ref: '',
        },
        admin_id: {
            type: mongoose.Types.ObjectId,
            ref: '',
        }
    },
    {
        timestamps : true
    })
)
module.exports = department;