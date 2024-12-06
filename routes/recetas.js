// routes/recetas.js
const express = require('express');
const Receta = require('../models/Receta');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recetas = await Receta.findAll();
        res.json(recetas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recetas' });
    }
});


router.post('/', async (req, res) => {
    try {
        const nuevaReceta = await Receta.create(req.body);
        res.status(201).json(nuevaReceta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear receta' });
    }
});

module.exports = router;
