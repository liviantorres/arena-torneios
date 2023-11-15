const router = require('express').Router();
const userController = require('../controllers/userController')


router.get('/register', async (req, res) =>{
    res.render('./tela-registro')
})

/* // Rota protegida que usa o middleware de verificação de autenticação
  app.get('/restrito', verificaAutenticacao, (req, res) => {
    res.send('Esta é uma rota protegida!');
  });
*/
router.post('/register', userController.registrarUsuario)

//router.post('/login', userController.loginUsuario)
 
router.get('/', userController.mostrarUsuarios)

router.get('/:id', userController.mostrarUsuariosPorId)

router.patch('/:id', userController.atualizarUsuarios)

router.delete('/:id', userController.deletarUsuario)

module.exports = router