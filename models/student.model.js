module.exports = (sequelize_config, Sequelize) => {
    const Student = sequelize_config.define('student',
    {
        student_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: { type: Sequelize.STRING, allowNull: false },
        last_name: { type: Sequelize.STRING, allowNull: false },
        class: { type: Sequelize.STRING },

        // add age (min 10), 
        // parent_phone_number (+256789090213),
        // gender (enum M, F), physical_address (kampala)
        // category (enum DAY, BOARDING)
        // status (bool 1, 0)
    },
        {
            defaultScope: {
                attributes: {
                    exclude: ['createdAt','updatedAt', 'student_id' ]
                }
            }
        }
    );

    return Student;
}