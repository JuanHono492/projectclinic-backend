// models/Receta.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const Paciente = require('./Paciente');

const Receta = sequelize.define('Receta', {
    RecetaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PacienteID: {
        type: DataTypes.INTEGER,
        references: {
            model: Paciente,
            key: 'PacienteID',
        },
    },
    MedicoID: DataTypes.INTEGER,
    FechaPrescripcion: DataTypes.DATE,
    Medicamentos: DataTypes.STRING,
    Estado: DataTypes.STRING,
}, {
    tableName: 'Recetas',
    timestamps: false,
});

Receta.belongsTo(Paciente, { foreignKey: 'PacienteID' });
module.exports = Receta;
