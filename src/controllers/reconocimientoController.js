const reconocimientoService = require('../services/recognitionServices'); // Importamos el servicio

const reconocimientoController = {
    // Guardar imagen de reconocimiento facial asociada a un usuario
    createReconocimiento: async (req, res) => {
        try {
            console.log("📸 Recibiendo datos en el backend...");
            console.log("req.file:", req.file); // Verifica si la imagen llega
            console.log("req.body:", req.body); // Verifica los datos recibidos

            const { id_usuario } = req.body; // ID del usuario desde la solicitud
            const fotoBuffer = req.file ? req.file.buffer : null; // Captura la imagen si se envió

            // ⚠️ Enviar los datos al servicio de reconocimiento facial
            const nuevoReconocimiento = await reconocimientoService.createReconocimiento(id_usuario, fotoBuffer);

            // Enviar respuesta al frontend
            res.status(201).json({
                message: "✅ Imagen de reconocimiento guardada correctamente.",
                reconocimiento: nuevoReconocimiento
            });
        } catch (error) {
            console.error("CONTROLLER❌ Error en createReconocimiento:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = reconocimientoController;
