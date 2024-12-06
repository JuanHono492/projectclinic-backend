// models/Authentication.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/BDAuth');

const Authentication = sequelize.define('Authentication', {
    AuthID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UsuarioIDHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    FechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Esto debería asignar la fecha y hora actual
    },
    UltimoCambio: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Activo'
    }
}, {
    tableName: 'Authentication',
    timestamps: false
});

module.exports = Authentication;
