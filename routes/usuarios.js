// routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Authentication = require('../models/Authentication');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: 'Hubo un problema al obtener los usuarios' });
    }
});

// Obtener un usuario por ID (basado en UsuarioID)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { UsuarioID: id } });
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: 'Hubo un problema al obtener el usuario' });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, apellido, dni, nombreUsuario, rol, correoElectronico, telefono, estado, contrasena } = req.body;

    try {
        // Generar el hash de UsuarioID basado en nombreUsuario + dni
        const usuarioIDHash = crypto.createHash('sha256').update(nombreUsuario + dni).digest('hex');

        // Crear un nuevo usuario
        const nuevoUsuario = await Usuario.create({
            UsuarioID: usuarioIDHash,  // Usamos el hash como ID de usuario
            Nombre: nombre,
            Apellido: apellido,
            DNI: dni,
            NombreUsuario: nombreUsuario,
            Rol: rol,
            CorreoElectronico: correoElectronico,
            Telefono: telefono,
            Estado: estado ? 1 : 0  // Convertir estado a 1 (activo) o 0 (inactivo)
        });

        // Crear un hash para la contraseña
        const passwordHash = await bcrypt.hash(contrasena, 10);

        // Crear la autenticación del usuario
        await Authentication.create({
            UsuarioIDHash: usuarioIDHash,
            PasswordHash: passwordHash,
            FechaCreacion: new Date(),
            Estado: 'Activo'  // Estado de autenticación
        });

        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'El nombre de usuario ya está en uso. Intenta con uno diferente.' });
        } else {
            console.error("Error al crear el usuario:", error);
            res.status(500).json({ error: 'Hubo un problema al crear el usuario' });
        }
    }
});

// Actualizar un usuario por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { UsuarioID: id } });
        if (usuario) {
            await usuario.update(req.body);
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ error: 'Hubo un problema al actualizar el usuario' });
    }
});

// Cambiar estado en lugar de eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { UsuarioID: id } });
        if (usuario) {
            await usuario.update({ Estado: 0 });  // Inactivar usuario (0 = inactivo)
            res.json({ message: 'Usuario inactivado' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al cambiar el estado del usuario:", error);
        res.status(500).json({ error: 'Hubo un problema al cambiar el estado del usuario' });
    }
});

module.exports = router;
