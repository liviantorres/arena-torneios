const router = require('express').Router();
const userController = require('../controllers/userController')

const User = require('../models/User')


/* // Rota protegida que usa o middleware de verificação de autenticação
  app.get('/restrito', verificaAutenticacao, (req, res) => {
    res.send('Esta é uma rota protegida!');
  });
*/
//router.post('/register', userController.registrarUsuario)

//router.post('/login', userController.loginUsuario)
 
router.get('/', userController.mostrarUsuarios)

router.get('/:id', userController.mostrarUsuariosPorId)

router.put('/editar-usuario', async (req, res) => {
  const userEmail = req.session.user; 

  const usuarioLogado = await User.findOne({email: userEmail});

  if (!userEmail) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  const { nome, email, senha } = req.body;

  const usuario = {
      nome,
      email,
      senha
  };

  try {
      const updateUser = await User.updateOne({ _id: usuarioLogado._id }, usuario);

      if (updateUser.result.nModified === 0) {
          return res.status(422).json({ message: 'O usuário não foi encontrado ou não houve alterações' });
      }

      res.redirect('/campeonato');
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', userController.atualizarUsuarios)

router.delete('/:id', userController.deletarUsuario)

module.exports = router