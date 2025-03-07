
//router.post('/usuarios', upload.single('foto'), usuarioController.createUser);
const express = require('express'); // Importar Express
const usuarioController = require('../controllers/userController');

const router = express.Router(); // 🚀 Definir el router antes de usarlo

router.get('/usuarios', usuarioController.getAllUsers);
router.post('/usuarios', usuarioController.createUser);

module.exports = router; // Exportar el router
