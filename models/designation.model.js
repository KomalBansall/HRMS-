const mongoose = require('mongoose');

const designationModel = mongoose.model(
    'Designation', mongoose.Schema({
        designation_name : {
            type : String
        },
        admin_id: {
            type: mongoose.Types.ObjectId,
            ref: '',
        },
        company_id:{
            type: String
        }
    },
    {
        timestamps : true
    })
)
module.exports = designationModel;