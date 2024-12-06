// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const Authentication = require('../models/Authentication');

const router = express.Router();

router.post('/', async (req, res) => {
    
    const { username, password } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos principal
        const usuario = await Usuario.findOne({ where: { NombreUsuario: username } });
        if (!usuario) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            
        }
        
        // Generar hash para buscar el usuario en la tabla de autenticación
        const usuarioIDHash = crypto.createHash('sha256').update(usuario.NombreUsuario + usuario.DNI).digest('hex');
        const authRecord = await Authentication.findOne({ where: { UsuarioIDHash: usuarioIDHash } });

        if (!authRecord) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Validar contraseña
        const passwordMatch = await bcrypt.compare(password, authRecord.PasswordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Enviar una respuesta de éxito al frontend
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
