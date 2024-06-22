const db = require("../models");
const Student = db.students;
const StudentFinance = db.studentfinances;
const StudentPayment = db.studentpayments;
const Operation = db.Sequelize.Op;

// Retrieve all Students from the db
exports.GetAllStudents = (req, res) => {
    Student.findAll({
        include: [StudentFinance]
    })
        .then(
            data => {
                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Students successfully retrieved",
                    number_of_students: data.length,
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Students"
            });
        }
        );
}

// Update
// using get and post
exports.UpdateStudent = (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "PUT"){

        // const student_id = req.body.t_id;
        // const student_id = req.params.id;
        // const student_id = req.query.t_id;
        const student_id = req.params.id;
        Student.update(req.body, {
            where: { student_id: student_id }
        }).then(
            data => {
                if(data == 1){
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Updated",
                    });
                }else{
                    res.send({
                        status: "Error",
                        status_code: 100,
                        message: "Student Not Updated",
                    }); 
                }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Create
exports.CreateStudent = (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "POST"){

        if(!req.body.first_name){
            res.send({
                status: "Error",
                status_code: 10012,
                message: "Student First Name is required",
            }); 

            return;
        }

        if(!req.body.last_name){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Student Last Name is required",
            }); 

            return;
        }

        if(!req.body.school_fees_amount){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Student Fees Amount is required",
            }); 

            return;
        }

        // Add code which detects a wrong field entered

        const student_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            class: req.body.class,
        }

        Student.create(student_data).then(
            async data => {
                // if(data == 1){
                    await StudentFinance.create({
                        student_id: data.student_id,
                        school_fees_amount: req.body.school_fees_amount
                    });

                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Added",
                        result: data
                    });
                // }else{
                //     res.send({
                //         status: "Error",
                //         status_code: 100,
                //         message: "Student Not Updated",
                //     }); 
                // }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Delete
exports.DeleteStudent = async (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "DELETE"){

        const student_id = req.params.id;
        const student_id_db = await Student.findByPk(student_id);

        if(student_id_db === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        Student.destroy({
            where: { student_id: student_id }
        }).then(
            data => {
                if(data == 1){
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Deleted",
                    });
                }else{
                    res.send({
                        status: "Error",
                        status_code: 100,
                        message: "Student Not Deleted",
                    }); 
                }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });
    
    
     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}


// Search Student
exports.SearchStudent = async (req, res) => {
    const search_query = req.query.first_name;
    var condition = search_query ? { first_name: { [Operation.like] : `%${search_query}%` } } : null;

    Student.findAll({where: condition})
        .then(
            data => {
                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Students successfully retrieved",
                    number_of_students: data.length,
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while searching Students"
            });
        }
        );

}


// Get student finances
// Retrieve all Students from the db
exports.GetStudentFinances = (req, res) => {
    StudentFinance.findAll({
        // include: [{model: Student, attributes: []}]
        include: [Student],
        // attributes: [
        //     'finance_id',
        //     [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total_expected'],
        // ],
        // group
    }).then(
            async data => {

                const total_expected = await StudentFinance.findAll({
                    attributes: [
                        // function to calc the sum
                        [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total'],
                    ],
                    raw: true,
                });

                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student Finances successfully retrieved",
                    number_of_students: data.length,
                    total_expected: total_expected[0]['total'],
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student Finances"
            });
        }
        );
}

// Make a payment
exports.MakePayment = async (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "POST"){

        const student_id_dbx = await Student.findByPk(req.body.student_id);
        if(student_id_dbx === null){

            res.send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database",
            }); 

            return;
        }

        if(!req.body.amount_paid){
            res.send({
                status: "Error",
                status_code: 10013,
                message: "Amount Paid is required",
            }); 

            return;
        }

        // Add code which detects a wrong field entered

        const payment_data = {
            amount_paid: req.body.amount_paid,
            student_id: req.body.student_id,
        }

        StudentPayment.create(payment_data).then(
            async data => {
                // if(data == 1){
                    

                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Payment Added",
                        result: data
                    });
                // }else{
                //     res.send({
                //         status: "Error",
                //         status_code: 100,
                //         message: "Student Not Updated",
                //     }); 
                // }
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student payment"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}

// Retrieve all Payments
exports.TotalPayments = (req, res) => {
    StudentPayment.findAll({
        // include: [{model: Student, attributes: []}]
        include: [Student],
        // attributes: [
        //     'finance_id',
        //     [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total_expected'],
        // ],
        // group
    }).then(
            async data => {

                const total_payments_received = await StudentPayment.findAll({
                    attributes: [
                        // function to calc the sum
                        [db.Sequelize.fn('sum', db.Sequelize.col('amount_paid')), 'total'],
                    ],
                    raw: true,
                });

                res.send({
                    status: "Success",
                    status_code: 1000,
                    message: "Student Payments successfully retrieved",
                    number_of_students: data.length,
                    total_payments_received: total_payments_received[0]['total'],
                    results: data
                });
            }

        ).catch(err => {
            res.send({
                status: "Error",
                status_code: 1001,
                message: err.message || "Error occurred while retrieving Student Finances"
            });
        }
        );
}

// Make a payment
exports.FeesBalance = async (req, res) => {
    
    console.log("METHOD");
    console.log(req.method);

     if(req.method == "GET"){

        StudentFinance.findAll({

        }).then(
            async data => {
            
                    res.send({
                        status: "Success",
                        status_code: 100,
                        message: "Student Balances",
                        result: data
                    });
                
            }
        ).catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While fetching student balances"
            });
        });

     }else{

        res.status(500).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });

     }

}
// Get student balance by ID
exports.getStudentBalance = async (req, res) => {
  const student_id = req.params.id;

  try {
    const student = await Student.findByPk(student_id);
    if (!student) {
      res.status(404).send({
        status: "Error",
        status_code: 404,
        message: `Student with ID ${student_id} not found`
      });
      return;
    }

    const studentFinance = await StudentFinance.findOne({
      where: { student_id: student_id }
    });

    if (!studentFinance) {
      res.status(404).send({
        status: "Error",
        status_code: 404,
        message: `Finance details not found for student ID ${student_id}`
      });
      return;
    }

    const totalPayments = await StudentPayment.sum('amount_paid', {
      where: { student_id: student_id }
    });

    const balance = studentFinance.school_fees_amount - totalPayments;

    res.send({
      status: "Success",
      status_code: 1000,
      message: `Balance for student ${student.first_name} ${student.last_name}`,
      student_id: student_id,
      balance: balance
    });

  } catch (err) {
    res.status(500).send({
      status: "Error",
      status_code: 500,
      message: err.message || "Error occurred while retrieving student balance"
    });
  }
};

// Get total balance for all students
exports.getTotalBalance = async (req, res) => {
  try {
    const totalExpected = await StudentFinance.sum('school_fees_amount');
    const totalPaymentsReceived = await StudentPayment.sum('amount_paid');

    const totalBalance = totalExpected - totalPaymentsReceived;

    res.send({
      status: "Success",
      status_code: 1000,
      message: "Total balance for all students",
      total_balance: totalBalance
    });

  } catch (err) {
    res.status(500).send({
      status: "Error",
      status_code: 500,
      message: err.message || "Error occurred while retrieving total balance"
    });
  }
};

// Get payments by individual student
exports.getPaymentsByStudent = async (req, res) => {
  const student_id = req.params.id;

  try {
    const student = await Student.findByPk(student_id);
    if (!student) {
      res.status(404).send({
        status: "Error",
        status_code: 404,
        message: `Student with ID ${student_id} not found`
      });
      return;
    }

    const payments = await StudentPayment.findAll({
      where: { student_id: student_id },
      include: [Student]
    });

    res.send({
      status: "Success",
      status_code: 1000,
      message: `Payments for student ${student.first_name} ${student.last_name}`,
      payments: payments
    });

  } catch (err) {
    res.status(500).send({
      status: "Error",
      status_code: 500,
      message: err.message || "Error occurred while retrieving payments"
    });
  }
};
// Notify Full Payment
const notifyFullPayment = async (student_id) => {
    try {
      const student = await Student.findByPk(student_id);
      // Add your notification logic here (e.g., sending an email or SMS)
      console.log(`Notification: ${student.first_name} ${student.last_name} has paid 100% of the school fees.`);
    } catch (err) {
      console.error(`Failed to send notification for student ID ${student_id}:`, err);
    }
  };