// models/Usuario.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Usuario = sequelize.define('Usuario', {
    UsuarioID: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false
    },
    DoctorID: {
        type: DataTypes.INTEGER,
        unique: true,
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
    NombreUsuario: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    Rol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CorreoElectronico: {
        type: DataTypes.STRING
    },
    Telefono: {
        type: DataTypes.STRING
    },
    UltimoAcceso: {
        type: DataTypes.DATE
    },
    FechaRegistro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },    
    Estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'Usuarios',
    timestamps: false
});

module.exports = Usuario;
