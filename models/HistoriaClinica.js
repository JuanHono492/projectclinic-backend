const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Paciente = require('./Paciente');
const Usuario = require('./Usuario');
const Cita = require('./Cita');

// Definición del modelo HistoriaClinica
const HistoriaClinica = sequelize.define('HistoriaClinica', {
    HistoriaClinicaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PacienteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'PacienteID'
        }
    },
    FechaConsulta: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DoctorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, 
            key: 'DoctorID' // Asegúrate de que 'DoctorID' exista como campo en 'Usuarios'
        }
    },
    Diagnostico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Tratamiento: {
        type: DataTypes.STRING
    },
    NotasAdicionales: {
        type: DataTypes.STRING
    },
    CitaID: {  // Nueva columna para asociar la cita completada
        type: DataTypes.INTEGER,
        references: {
            model: Cita,
            key: 'CitaID'
        }
    }
}, {
    tableName: 'HistoriasClinicas',
    timestamps: false
});

// Definir relaciones
HistoriaClinica.belongsTo(Paciente, { foreignKey: 'PacienteID', targetKey: 'PacienteID' });
HistoriaClinica.belongsTo(Usuario, { as: 'Medico', foreignKey: 'DoctorID', targetKey: 'DoctorID' });
HistoriaClinica.belongsTo(Cita, { foreignKey: 'CitaID', targetKey: 'CitaID' });

HistoriaClinica.belongsTo(Cita, { foreignKey: 'CitaID' });

module.exports = HistoriaClinica;
