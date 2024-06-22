module.exports = (sequelize_config, Sequelize) => {
    const _Student = require("./student.model");
    const StudentPayment = sequelize_config.define("studentpayment",
        {
            payment_id: { 
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                reference: {
                    model: _Student,
                    key: 'student_id'
                }
                },
            amount_paid: {
                type: Sequelize.INTEGER,
                allowNull: false,
                },

        }
    );

    return StudentPayment;
}