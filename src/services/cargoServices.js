const db = require('../config/database'); // Importa la conexión a la base de datos
const Cargo = require('../models/cargoModel'); // Importa el modelo Cargo

const cargoService = {
    // Obtener todos los cargos
    getAllCargos: async () => {
        const query = 'SELECT * FROM cargo'; // Consulta SQL para obtener todos los cargos
        try {
            const [results] = await db.promise().query(query); // Ejecutamos la consulta con promesas
            return results.map(row => new Cargo(row.id_cargo, row.nombre_cargo, row.descripcion)); 
            // Convertimos cada fila del resultado en una instancia de Cargo
        } catch (err) {
            throw err; // Si hay un error, lo propagamos para que lo maneje el controlador
        }
    },

    // Obtener un cargo por ID
    getCargoById: async (id_cargo) => {
        const query = 'SELECT * FROM cargo WHERE id_cargo = ?'; // Consulta SQL con filtro por ID
        try {
            const [results] = await db.promise().query(query, [id_cargo]); // Ejecutamos la consulta con el ID como parámetro

            if (results.length === 0) return null; // Si no se encuentra el cargo, devolvemos null

            return new Cargo(results[0].id_cargo, results[0].nombre_cargo, results[0].descripcion);
            // Convertimos el primer resultado en una instancia de Cargo
        } catch (err) {
            throw err; // Propagamos el error para que lo maneje el controlador
        }
    },

   // Crear un nuevo cargo
   createCargo: async (cargoData) => {
    const query = 'INSERT INTO cargo (nombre_cargo, descripcion) VALUES (?, ?)'; 
    // Consulta SQL para insertar un nuevo cargo
    try {
        const [result] = await db.promise().query(query, [cargoData.getNombreCargo(), cargoData.getDescripcion()]);
        // Insertamos los valores usando los getters de Cargo

        return new Cargo(result.insertId, cargoData.getNombreCargo(), cargoData.getDescripcion());
        // Creamos un nuevo objeto Cargo con el ID generado
    } catch (err) {
        throw err; // Propagamos el error
    }
    },

    updateCargo: async (id_cargo, nombre_cargo, descripcion) => {
        const query = `UPDATE cargo SET nombre_cargo = ?, descripcion = ? WHERE id_cargo = ?`;
        
        try {
            const [result] = await db.promise().query(query, [nombre_cargo, descripcion, id_cargo]);
            return result; // Retorna el resultado de la consulta
        } catch (err) {
            console.error("❌ Error en updateCargo (Service):", err);
            throw err;
        }
    },
     // Eliminar un cargo
     deleteCargo: async (id_cargo) => {
        const query = 'DELETE FROM cargo WHERE id_cargo = ?'; // Consulta SQL para eliminar un cargo por ID
        try {
            const [result] = await db.promise().query(query, [id_cargo]);

            if (result.affectedRows === 0) return null; // Si no se eliminó nada, el cargo no existe

            return { message: 'Cargo eliminado correctamente' }; // Retornamos un mensaje de éxito
        } catch (err) {
            throw err; // Propagamos el error
        }
    }


};

// Exporta el servicio para que pueda ser utilizado en otros archivos
module.exports = cargoService;
