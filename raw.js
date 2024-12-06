const sequelize = require('./config/database'); // Asegúrate de que la ruta sea correcta

async function fetchHistoriasClinicas() {
    try {
        const historias = await sequelize.query(`
            SELECT hc.*, 
                   p.Nombre AS PacienteNombre, p.Apellido AS PacienteApellido, p.DNI AS PacienteDNI, 
                   u.Nombre AS MedicoNombre, u.Apellido AS MedicoApellido
            FROM HistoriasClinicas AS hc
            LEFT JOIN Pacientes AS p ON hc.PacienteID = p.PacienteID
            LEFT JOIN Usuarios AS u ON hc.DoctorID = u.DoctorID
        `, { type: sequelize.QueryTypes.SELECT });

        console.log(historias);
    } catch (error) {
        console.error("Error al obtener historias clínicas:", error);
    }
}

fetchHistoriasClinicas();
