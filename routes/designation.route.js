const designationController = require('../controllers/designation.control');

module.exports = function designationRoute(app) {

    app.post('/createDesignation', designationController.createDesignation);
    app.put('/updateDesignation/:id', designationController.updateDesignation);
    app.get('/getListDesignation', designationController.designationList);
    app.get('/getDetailDesignation/:id', designationController.detailsById);
}
