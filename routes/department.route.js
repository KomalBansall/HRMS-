const departmentController = require('../controllers/department.control');

module.exports = function departmentRoute(app) {

    app.post('/createDepartment', departmentController.createDepartment);
    app.put('/updateDepartments/:id', departmentController.updateDepartmentDetails);
    app.get('/getListDepartment', departmentController.departmentList);
    app.get('/getDetailDepartment/:id', departmentController.detailsById);
}
