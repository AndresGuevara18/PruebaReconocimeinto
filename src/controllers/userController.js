const usuarioService = require('../services/userServices'); // Importar el servicio de usuario

const usuarioController = {
    // 🔹 Obtener todos los usuarios
    getAllUsers: (req, res) => {
        usuarioService.getAllUsers((err, usuarios) => {
            if (err) {
                res.status(500).json({ error: "Error al obtener los usuarios" });
                return;
            }
            res.json(usuarios);
        });
    },

    // 🔹 Crear un nuevo usuario
    createUser: async (req, res) => {
        try {
            // Datos del formulario (excepto la imagen)
            const usuarioData = {
                tipo_documento: req.body.tipo_documento,
                numero_documento: req.body.numero_documento,
                nombre_empleado: req.body.nombre_empleado,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                email_empleado: req.body.email_empleado,
                eps: req.body.eps,
                usuario: req.body.usuario,
                contrasena: req.body.contrasena,
                id_cargo: req.body.id_cargo,
            };

            // Verificar si se recibió la imagen
            if (!req.file) {
                throw new Error("No se recibió la imagen.");
            }

            // Obtener el archivo de imagen
            const fotoBuffer = req.file.buffer; // Buffer de la imagen

            // Llamar al servicio para crear el usuario
            const nuevoUsuario = await usuarioService.createUser(usuarioData, fotoBuffer);

            res.status(201).json({
                message: "✅ Usuario creado exitosamente.",
                usuario: nuevoUsuario
            });
        } catch (error) {
            console.error("❌ Error en createUser:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = usuarioController;
