require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database'); // Conexión a la base de datos principal
const { sequelizeAuth } = require('./config/BDAuth'); // Conexión a la base de datos de autenticación

const app = express();

// Configuración
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configuración de CORS
app.use(
    cors({
        origin: FRONTEND_URL, // URL del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Middleware para manejar datos JSON
app.use(express.json());

// Importar modelos
const Usuario = require('./models/Usuario');
const Cita = require('./models/Cita');
const Paciente = require('./models/Paciente');
const HistoriaClinica = require('./models/HistoriaClinica');

// Definir relaciones después de que todos los modelos estén cargados
Usuario.hasMany(Cita, { as: 'Citas', foreignKey: 'DoctorID' });
Cita.belongsTo(Usuario, { as: 'Doctor', foreignKey: 'DoctorID' });

Paciente.hasMany(Cita, { as: 'CitasPaciente', foreignKey: 'PacienteID' });
Cita.belongsTo(Paciente, { as: 'PacienteCita', foreignKey: 'PacienteID' });

Paciente.hasMany(HistoriaClinica, { as: 'HistoriasPaciente', foreignKey: 'PacienteID' });
HistoriaClinica.belongsTo(Paciente, { as: 'PacienteHistoria', foreignKey: 'PacienteID' });

Usuario.hasMany(HistoriaClinica, { as: 'HistoriasMedico', foreignKey: 'DoctorID' });
HistoriaClinica.belongsTo(Usuario, { as: 'MedicoHistoria', foreignKey: 'DoctorID' });

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/usuarios');
const historiasClinicasRoute = require('./routes/historiaclinica');
const citasRoutes = require('./routes/citas');
const doctoRoutes = require('./routes/doctor');
const pacienteRoutes = require('./routes/pacientes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/historias', historiasClinicasRoute);
app.use('/api/citas', citasRoutes);
app.use('/api/doctores', doctoRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Conectar a las bases de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa');
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

startServer();
