const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const HistoriaClinica = require('../models/HistoriaClinica'); // Importar HistoriaClinica
const { Sequelize } = require('sequelize');

// Configurar la conexión a la base de datos
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

// Obtener todas las citas
// Obtener todas las citas con una consulta SQL personalizada
router.get('/', async (req, res) => {
    try {
        // Realizar la consulta SQL personalizada
        const [citas, metadata] = await sequelize.query(`
            SELECT 
                Cita.CitaID, Cita.PacienteID, Cita.DoctorID, Cita.FechaCita, Cita.HoraCita, 
                Cita.MotivoCita, Cita.Estado, Cita.DescripcionCita,
                PacienteCita.Nombre AS PacienteNombre, PacienteCita.Apellido AS PacienteApellido, PacienteCita.DNI AS PacienteDNI,
                Doctor.Nombre AS DoctorNombre, Doctor.Apellido AS DoctorApellido
            FROM Citas AS Cita
            LEFT JOIN Pacientes AS PacienteCita ON Cita.PacienteID = PacienteCita.PacienteID
            LEFT JOIN Usuarios AS Doctor ON Cita.DoctorID = Doctor.DoctorID;
        `);

        // Enviar la respuesta con las citas obtenidas
        res.json(citas);
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
});



// Crear una nueva cita
router.post('/', async (req, res) => {
    console.log(req.body);  // Verifica los datos recibidos
    const { PacienteID, DoctorID, FechaCita, HoraCita, MotivoCita, Estado, DescripcionCita } = req.body;

    // Verifica que todos los campos necesarios están presentes
    if (!PacienteID || !DoctorID || !FechaCita || !HoraCita || !MotivoCita || !Estado || !DescripcionCita) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para crear la cita' });
    }

    try {
        // Intentamos crear la nueva cita
        const nuevaCita = await Cita.create({
            PacienteID,
            DoctorID,
            FechaCita,
            HoraCita,
            MotivoCita,
            Estado,
            DescripcionCita
        });

        // Si se crea con éxito, devolvemos la respuesta
        res.status(201).json({
            message: 'Cita creada exitosamente',
            cita: nuevaCita
        });
    } catch (error) {
        console.error("Error al crear cita:", error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Ya existe una cita con este paciente y doctor en esa fecha y hora' });
        }

        res.status(500).json({ error: 'Error al crear la cita', message: error.message });
    }
});

// Completar una cita y crear historia clínica
router.put('/completar/:id', async (req, res) => {
    const citaID = req.params.id;
    const { Diagnostico, Tratamiento, NotasAdicionales } = req.body;

    // Verifica que los datos necesarios estén presentes
    if (!Diagnostico || !Tratamiento) {
        return res.status(400).json({ error: 'Faltan datos para completar la cita' });
    }

    try {
        // Primero, actualizamos el estado de la cita
        const cita = await Cita.findByPk(citaID);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Cambiar el estado de la cita a "Completada"
        cita.Estado = 'Completada';
        await cita.save();

        // Ahora, creamos la historia clínica asociada
        const historiaClinica = await HistoriaClinica.create({
            PacienteID: cita.PacienteID,
            FechaConsulta: new Date(),
            DoctorID: cita.DoctorID,
            Diagnostico,
            Tratamiento,
            NotasAdicionales,
            CitaID: cita.CitaID // Relacionamos la historia clínica con la cita
        });

        res.json({
            message: 'Cita completada y se ha creado la historia clínica',
            historiaClinica
        });
    } catch (error) {
        console.error("Error al completar la cita:", error);
        res.status(500).json({ error: 'Error al completar la cita', message: error.message });
    }
});












// Completar una cita y crear historia clínica (sin actualizar estado)
router.put('/completar/:id', async (req, res) => {
    const citaID = req.params.id;
    const { Diagnostico, Tratamiento, NotasAdicionales } = req.body;

    // Verifica que los datos necesarios estén presentes
    if (!Diagnostico || !Tratamiento) {
        return res.status(400).json({ error: 'Faltan datos para completar la cita' });
    }

    try {
        // Verificar si la cita existe
        const cita = await Cita.findByPk(citaID);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Crear la historia clínica asociada sin modificar el estado de la cita
        const historiaClinica = await HistoriaClinica.create({
            PacienteID: cita.PacienteID,
            FechaConsulta: new Date(),
            DoctorID: cita.DoctorID,
            Diagnostico,
            Tratamiento,
            NotasAdicionales,
            CitaID: cita.CitaID // Relacionamos la historia clínica con la cita
        });

        res.json({
            message: 'Se ha creado la historia clínica',
            historiaClinica
        });
    } catch (error) {
        console.error("Error al completar la cita:", error);
        res.status(500).json({ error: 'Error al completar la cita', message: error.message });
    }
});


module.exports = router;
