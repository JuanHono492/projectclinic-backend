const express = require('express');
const router = express.Router();
const HistoriaClinica = require('../models/HistoriaClinica');
const Paciente = require('../models/Paciente');
const Usuario = require('../models/Usuario');
const Cita = require('../models/Cita');
const { sequelize } = require('../config/database');


// Ruta para crear un historial clínico
router.post('/crear', async (req, res) => {
    const { PacienteID, CitaID, FechaConsulta, DoctorID, Diagnostico, Tratamiento, NotasAdicionales } = req.body;

    try {
        // Crear nuevo historial clínico
        const nuevaHistoria = await HistoriaClinica.create({
            PacienteID,
            CitaID,
            FechaConsulta,
            DoctorID,
            Diagnostico,
            Tratamiento,
            NotasAdicionales
        });

        res.status(201).json(nuevaHistoria); // Retorna la respuesta con el historial creado
    } catch (error) {
        console.error('Error al crear el historial clínico:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el historial clínico' });
    }
});





router.get('/', async (req, res) => {
    try {
        // Obtener todas las historias clínicas con solo los campos de Cita que necesitas
        const historias = await HistoriaClinica.findAll({
            include: [
                { model: Paciente, attributes: ['Nombre', 'Apellido', 'DNI', 'Genero', 'TipoSangre'] },
                { model: Usuario, as: 'Medico', attributes: ['Nombre', 'Apellido'] },
                {
                    model: Cita,
                    attributes: ['MotivoCita', 'Estado', 'DescripcionCita'], // Solo los campos que necesitas de Cita
                    required: true // Asegurarse de que la cita siempre se incluya
                }
            ]
        });

        // Depuración para ver la estructura completa de las historias
        console.log(JSON.stringify(historias, null, 2)); // Ver todo el contenido de las historias

        // Acceder a los datos de Cita y otros modelos
        const historiasConDatos = historias.map(h => ({
            ...h.dataValues,
            Paciente: h.Paciente ? h.Paciente.dataValues : {},
            Medico: h.Medico ? h.Medico.dataValues : {},
            Cita: h.Citas ? h.Citas[0]?.dataValues : {} // Reemplazar 'Citum' por el nombre correcto
        }));

        if (!historiasConDatos.length) {
            return res.status(404).json({ message: 'No se encontraron historias clínicas.' });
        }

        res.status(200).json(historiasConDatos); // Devolver las historias clínicas con los datos correctos
    } catch (error) {
        console.error('Error al obtener historias clínicas:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener las historias clínicas' });
    }
});


module.exports = router;
