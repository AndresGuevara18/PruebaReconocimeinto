
//router.post('/usuarios', upload.single('foto'), usuarioController.createUser);
const express = require('express'); // Importar Express
const usuarioController = require('../controllers/userController');
const multer = require('multer');//npm install multer
const router = express.Router(); // 🚀 Definir el router antes de usarlo

// Configurar multer para manejar la carga de archivos en memoria
const storage = multer.memoryStorage(); // Almacena el archivo en memoria como un Buffer
const upload = multer({ storage: storage });


router.get('/usuarios', usuarioController.getAllUsers);
//router.post('/usuarios', usuarioController.createUser);
router.post('/usuarios', upload.single('foto'), usuarioController.createUser);

module.exports = router; // Exportar el router
