const sequelize = require('./config/database.js'); // Importa la configuración de Sequelize

async function testConnection() {
    try {
        await sequelize.authenticate(); // Intenta conectarte a la base de datos
        console.log('Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}

testConnection(); // Ejecuta la función de prueba
