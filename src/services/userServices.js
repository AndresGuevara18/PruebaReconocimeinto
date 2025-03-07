const db = require('../config/database'); // Importamos la base de datos
const Usuario = require('../models/userModel'); // Importamos el modelo de usuario
const reconocimientoService = require('./reconocimientoServices'); // Importamos el servicio de reconocimiento
const bcrypt = require('bcrypt'); // Importamos bcrypt para encriptar contraseñas

const usuarioService = {
    // 🔹 Obtener todos los usuarios desde la base de datos
    getAllUsers: (callback) => {
        db.query('SELECT * FROM usuario', (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            const usuarios = results.map(row => 
                new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.nombre_empleado, row.email_empleado, row.contrasena, row.id_cargo)
            );
            callback(null, usuarios);
        });
    },

    // 🔹 Crear un usuario y agregarlo a la base de datos
    createUser: async (usuarioData) => {
        // ✅ Creamos una instancia del usuario con los datos recibidos
        const usuario = new Usuario( null, usuarioData.tipo_documento, usuarioData.numero_documento, 
            usuarioData.nombre_empleado, usuarioData.email_empleado, usuarioData.contrasena, 
            usuarioData.id_cargo);

        // ⚠️ Verificar si el usuario ya existe (evita duplicados)
        const checkQuery = 'SELECT id_usuario FROM usuario WHERE numero_documento = ? OR email_empleado = ?';
        const [existingUser] = await db.promise().query(checkQuery, [usuario.getNumeroDocumento(), usuario.getEmailEmpleado()]);
        //condicional
        if (existingUser.length > 0) {
            throw new Error("⚠️ El usuario con este documento o correo ya existe.");
        }

        //Hashear la contraseña antes de guardarla 
        const hashedPassword = await bcrypt.hash(usuario.getContrasena(), 10);

        //Insertamos el usuario en la base de datos
        const insertQuery = ` INSERT INTO usuario (tipo_documento, numero_documento, nombre_empleado, email_empleado, contrasena, id_cargo) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        //sentencia try para errores
        try {
            const [result] = await db.promise().query(insertQuery, [
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getNombreEmpleado(),
                usuario.getEmailEmpleado(),
                hashedPassword,
                usuario.getIdCargo()
            ]);

            usuario.setIdUsuario(result.insertId); // 🔹 Guardamos el ID generado

            // 🔹 Insertamos el ID del usuario en reconocimiento_facial 
            await reconocimientoService.createReconocimiento(usuario.getIdUsuario(), null);//null imagen segundo parametro

            return usuario;
        } catch (err) {
            throw new Error("❌ Error al crear el usuario: " + err.message);
        }
    }
};

module.exports = usuarioService; // Exportamos el servicio
