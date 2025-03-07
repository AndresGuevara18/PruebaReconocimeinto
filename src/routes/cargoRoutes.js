const express = require('express'); // Importa Express
const cargoController = require('../controllers/cargoController'); // Importa el controlador de Cargo

const router = express.Router(); // Crea un enrutador con Express.Router()

// Ruta para obtener todos los cargos
router.get('/cargos', cargoController.getAllCargos);

// Ruta para obtener un cargo por su ID
router.get('/cargos/:id_cargo', cargoController.getCargoById);

//ruta agregar cargo
router.post('/cargos', cargoController.createCargo);

// Ruta para actualizar un cargo
router.put('/cargos/:id_cargo', cargoController.updateCargo);

// Ruta para eliminar un cargo
router.delete('/cargos/:id_cargo', cargoController.deleteCargo);

// Exporta el enrutador para ser usado en otros archivos
module.exports = router;
