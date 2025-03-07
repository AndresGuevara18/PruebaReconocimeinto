const Cargo = require('../models/cargoModel');
const cargoService = require('../services/cargoServices'); // Importar el servicio de cargo

// Objeto que contendrá los métodos del controlador
const cargoController = {

    // Método para obtener todos los cargos
    // Método para obtener todos los cargos
    getAllCargos: async (req, res) => {
        try {
            const cargos = await cargoService.getAllCargos(); // Llamamos al servicio que obtiene todos los cargos
            res.json(cargos); // Enviamos la lista de cargos en formato JSON
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los cargos" }); // Si hay error, respondemos con código 500
        }
    }, 

    // Método para obtener un cargo por su ID
    getCargoById: async (req, res) => {
        try {
            const { id_cargo } = req.params; // Extraemos el ID de los parámetros de la URL
            const cargo = await cargoService.getCargoById(id_cargo); // Llamamos al servicio para buscar el cargo

            if (!cargo) {
                return res.status(404).json({ error: "Cargo no encontrado" }); // Si no se encuentra, devolvemos error 404
            }

            res.json(cargo); // Si se encuentra, lo enviamos en formato JSON
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el cargo en el controlador" }); // Manejo de error en la consulta
        }
    },

    // Método para agregar un nuevo cargo
    createCargo: async (req, res) => {
        try {
            const { nombre_cargo, descripcion } = req.body; // Extraemos datos del cuerpo de la solicitud
            const nuevoCargo = new Cargo(null, nombre_cargo, descripcion); // Creamos una instancia de Cargo con los datos

            const cargoCreado = await cargoService.createCargo(nuevoCargo); // Llamamos al servicio para crear el cargo

            res.status(201).json({
                message: "✅ Cargo agregado correctamente",
                cargo: cargoCreado, // Enviamos el nuevo cargo creado
                redirect: "/cargo.html" // URL a la que se redirigirá el usuario
            });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el cargo" }); // Manejo de errores
        }
    },

    // Método para actualizar un cargo
    updateCargo: async (req, res) => {
        try {
            const { id_cargo } = req.params;
            const { nombre_cargo, descripcion } = req.body;
        
            if (!nombre_cargo || !descripcion) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }
        
            const resultado = await cargoService.updateCargo(id_cargo, nombre_cargo, descripcion);
        
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cargo no encontrado" });
            }
        
            res.json({ message: "Cargo actualizado correctamente" });
        } catch (error) {
            console.error("❌ Error en updateCargo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Método para eliminar un cargo
    deleteCargo: async (req, res) => {
        try {
            const { id_cargo } = req.params; // Extraemos el ID del cargo desde la URL
            const resultado = await cargoService.deleteCargo(id_cargo); // Llamamos al servicio para eliminar

            if (!resultado) {
                return res.status(404).json({ error: "Cargo no encontrado" }); // Si no existe, devolvemos error 404
            }

            res.json({ message: "✅ Cargo eliminado correctamente" }); // Enviamos mensaje de éxito
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el cargo" }); // Manejo de errores
        }
    }
};

// Exporta el objeto para ser utilizado en otros archivos
module.exports = cargoController;
