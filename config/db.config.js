module.exports = {
    HOST: "localhost", // hostname
    PORT: "3306",
    USER: "root", // username
    PASSWORD: "", // user password
    DB: "studentms2", // database name
    dialect: "mysql", // database type
    pool: {
        // maximum number of connections
        max: 5,
        // minimum number of connections
        min: 0,
        // maximum time in milliseconds, that the pool will try to get a connection
        acquire: 30000,
        // maximum time, in milliseconds, that the connection can be idle before being released
        idle: 10000
    }
}