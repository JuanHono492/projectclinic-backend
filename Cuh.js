const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function generarHashes(nombreUsuario, dni, password) {
    // Generar el UsuarioIDHash usando SHA-256 basado en nombreUsuario y DNI
    const usuarioIDHash = crypto.createHash('sha256').update(nombreUsuario + dni).digest('hex');

    // Hashear la contraseña con bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    return { usuarioIDHash, passwordHash };
}

// Ejemplo de uso
const nombreUsuario = 'Juan_Hono';
const dni = '12345678'; // Reemplaza esto con el DNI del usuario
const password = '987612345_Hono';

generarHashes(nombreUsuario, dni, password).then(({ usuarioIDHash, passwordHash }) => {
    console.log('UsuarioIDHash:', usuarioIDHash);
    console.log('PasswordHash:', passwordHash);
});
