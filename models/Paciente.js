const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Cita = require('./Cita'); // Importación correcta de Cita

const Paciente = sequelize.define('Paciente', {
    PacienteID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DNI: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    FechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Genero: {
        type: DataTypes.STRING(1)
    },
    EstadoCivil: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Ocupacion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    TipoSangre: {
        type: DataTypes.STRING(3)
    },
    Telefono: {
        type: DataTypes.STRING
    },
    CorreoElectronico: {
        type: DataTypes.STRING
    },
    FechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'Pacientes',
    timestamps: false
});

// Relación con Cita
Paciente.hasMany(Cita, { foreignKey: 'PacienteID', sourceKey: 'PacienteID' });

module.exports = Paciente;
