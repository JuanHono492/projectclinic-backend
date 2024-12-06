// routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { Model } = require('sequelize');


router.get('/', async (req, res) => {
    console.log(req.body)
    try {
        const doctores = await Usuario.findAll({
            where: { Rol: 'Medico' },
            attributes: ['DoctorID', 'Nombre', 'Apellido']
        });

        if (!doctores || doctores.length === 0) {
            return res.status(404).json({ message: 'No se encontraron doctores' });
        }

        res.json(doctores);
    } catch (error) {
        console.error("Error al obtener doctores:", error);
        res.status(500).json({ error: 'Hubo un problema al obtener la lista de doctores' });
    }
});


module.exports = router;
