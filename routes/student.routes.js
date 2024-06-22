module.exports = app => {
    // importing a student controller
    const student_controller = require("../controllers/student.controller");

    // import Router interface from express module
    var router = require("express").Router();

    // http://localhost:8080/api/studentms2/getstudents
    // route to fetch all students
    router.get("/getstudents", student_controller.GetAllStudents);

    // route to update a specific Student
    router.all("/updatestudent/:id", student_controller.UpdateStudent);

    // route to update a specific Student
    router.all("/deletestudent/:id", student_controller.DeleteStudent);

    // route to update a specific Student
    router.all("/addstudent", student_controller.CreateStudent);

    // route to search a specific student by first name
    router.get("/findstudent", student_controller.SearchStudent);

    // route to get finances of all students
    router.get("/getstudentfinances", student_controller.GetStudentFinances);

    // route to make payment
    router.post("/makepayment", student_controller.MakePayment);

    // route to make payment
    router.get("/totalpayments", student_controller.TotalPayments);

    // route to make payment
    router.get("/feesbalances", student_controller.FeesBalance);

    // Student balances
router.get('/students/balance/:id', studentController.getStudentBalance);

// Total balance
router.get('/students/total-balance', studentController.getTotalBalance);

// Payments by student
router.get('/students/payments/:id', studentController.getPaymentsByStudent);

// Fees balance
router.get('/students/fees-balance', studentController.getFeesBalance);

// Notify full payment
router.post('/students/notify-full-payment/:id', studentController.notifyFullPayment);


    // define the base route
    app.use('/api/studentms2', router);

}