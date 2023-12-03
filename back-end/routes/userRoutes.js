const router = require('express').Router();
const userController = require('../controllers/userController')

const User = require('../models/User')
 
router.get('/', userController.mostrarUsuarios)

router.get('/:id', userController.mostrarUsuariosPorId)
/*
router.put('/editar-usuario/:emailUsuario', async (req, res) => {
  const userEmail = req.params.emailUsuario; 

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
*/
router.put('/editar-usuario/:emailUsuario', async (req, res) => {
  const userEmail = req.params.emailUsuario; 

  try {
    const usuarioAtualizado = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: req.body },
      { new: true } // Retorna o documento atualizado
    );

    if (!usuarioAtualizado) {
      return res.status(422).json({ message: 'O usuário não foi encontrado ou não houve alterações' });
    }

    res.redirect('/campeonato');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/editar-usuario/:emailUsuario', async (req, res) => {
  const userEmail = req.params.emailUsuario; 

  try {
    const usuarioAtualizado = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: req.body },
      { new: true } // Retorna o documento atualizado
    );

    if (!usuarioAtualizado) {
      return res.status(422).json({ message: 'O usuário não foi encontrado ou não houve alterações' });
    }

    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', userController.atualizarUsuarios)

router.delete('/:id', userController.deletarUsuario)

module.exports = router