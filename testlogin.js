const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Usuario = require('./models/Usuario'); // Usa 'Usuario' en singular
const Authentication = require('./models/Authentication');

async function testLogin(nombreUsuario, password) {
    try {
        const usuario = await Usuario.findOne({ where: { NombreUsuario: nombreUsuario } });
        if (!usuario) {
            return console.log('Usuario no encontrado');
        }

        const usuarioIDHash = crypto.createHash('sha256').update(usuario.NombreUsuario + usuario.DNI).digest('hex');
        const authRecord = await Authentication.findOne({ where: { UsuarioIDHash: usuarioIDHash } });

        if (!authRecord) {
            return console.log('Registro de autenticación no encontrado');
        }

        const passwordMatch = await bcrypt.compare(password, authRecord.PasswordHash);
        if (!passwordMatch) {
            return console.log('Contraseña incorrecta');
        }

        console.log('Inicio de sesión exitoso');
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
    }
}

testLogin('Juan_Hono', '987612345_Hono');
