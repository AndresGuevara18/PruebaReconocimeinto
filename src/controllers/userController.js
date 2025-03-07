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
            const usuarioData = req.body;
            const fotoBuffer = req.file ? req.file.buffer : null;

            const nuevoUsuario = await usuarioService.createUser(usuarioData, fotoBuffer);

            res.status(201).json({
                message: "✅ Usuario creado exitosamente.",
                usuario: nuevoUsuario
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = usuarioController;
