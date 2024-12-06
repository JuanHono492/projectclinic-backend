// dbService.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // Nombre de la base de datos
    process.env.DB_USER, // Usuario
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST, // Servidor
        dialect: 'mssql', // Dialecto para SQL Server
        port: process.env.DB_PORT || 5000, // Puerto
        dialectOptions: {
            options: {
                encrypt: true, // Requerido para Azure SQL
                enableArithAbort: true, // Mejor para SQL Server
            },
        },
        logging: false, // Desactiva logs de consultas SQL
    }
);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to SQL Server has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        throw error;
    }
};

module.exports = { sequelize, connectToDatabase };
