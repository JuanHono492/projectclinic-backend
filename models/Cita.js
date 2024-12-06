const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

let Doctor;
let Paciente;

const Cita = sequelize.define('Cita', {
    CitaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PacienteID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DoctorID: {
        type: DataTypes.INTEGER,  // Relación correcta con DoctorID
        allowNull: true
    },
    FechaCita: {
        type: DataTypes.DATE,
        allowNull: false
    },
    HoraCita: {
        type: DataTypes.TIME,
        allowNull: false
    },
    MotivoCita: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DescripcionCita: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Citas',
    timestamps: false
});

// Definir relaciones
// Definir relaciones
Cita.associate = (models) => {
    Paciente = models.Paciente;
    Doctor = models.Usuario;  // Aquí nos referimos al modelo 'Usuario', no 'Doctor'

    Cita.belongsTo(Paciente, { foreignKey: 'PacienteID' });
    Cita.belongsTo(Doctor, { foreignKey: 'DoctorID' });  // Relación con DoctorID
    Cita.hasMany(HistoriaClinica, { foreignKey: 'CitaID' });
};


module.exports = Cita;
