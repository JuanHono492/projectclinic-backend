const express = require('express');
const Paciente = require('../models/Paciente'); // Importa el modelo de Paciente
const router = express.Router();

// Obtener todos los pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
});

// Obtener un paciente por ID
router.get('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (paciente) res.json(paciente);
        else res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener paciente' });
    }
});

// Crear un nuevo paciente
router.post('/', async (req, res) => {
    try {
        const nuevoPaciente = await Paciente.create(req.body);
        res.status(201).json(nuevoPaciente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear paciente' });
    }
});

// Actualizar un paciente por ID
router.put('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (paciente) {
            await paciente.update(req.body);
            res.json(paciente);
        } else res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar paciente' });
    }
});

// Cambiar el estado de un paciente a "inactivo" en lugar de eliminarlo
router.delete('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (paciente) {
            await paciente.update({ Activo: false }); // Cambia el estado a inactivo
            res.json({ message: 'Paciente marcado como inactivo' });
        } else res.status(404).json({ error: 'Paciente no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado del paciente' });
    }
});
// routes/pacientes.js - Agrega esta ruta
router.get('/historia/:numeroHistoria', async (req, res) => {
    try {
        const paciente = await Paciente.findOne({ where: { NumeroHistoria: req.params.numeroHistoria } });
        if (paciente) {
            res.json(paciente);
        } else {
            res.status(404).json({ error: 'Paciente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el paciente' });
    }
});

module.exports = router;
