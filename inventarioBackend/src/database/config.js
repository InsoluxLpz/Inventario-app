const mysql = require('mysql2/promise'); // Cambiar a la versión de Promises
require("dotenv").config();

const dbConexion = () => {
    const db = mysql.createPool({ // Recomendado usar un pool para mejor gestión de conexiones
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DATABASE,
        waitForConnections: true,
        connectionLimit: 2, // Número máximo de conexiones simultáneas
        queueLimit: 5
    });
    
    return db;
};

console.log('Base de datos conectada con exito');
module.exports = {
    dbConexion
};
