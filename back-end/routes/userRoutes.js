const router = require('express').Router();
const userController = require('../controllers/userController')

router.post('/register', userController.registrarUsuario)

router.post('/login', userController.loginUsuario)
 
router.get('/', userController.mostrarUsuarios)

router.get('/:id', userController.mostrarUsuariosPorId)

router.patch('/:id', userController.atualizarUsuarios)

router.delete('/:id', userController.deletarUsuario)

module.exports = router