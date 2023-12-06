const router = require('express').Router();
const userController = require('../controllers/userController')

const User = require('../models/User')
 
router.get('/', userController.mostrarUsuarios)

router.get('/:id', userController.mostrarUsuariosPorId)


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

    res.redirect('/logout');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const usuario = await User.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(422).json({ message: 'O usuário não foi encontrado' });
    }

    console.log('Usuário excluído:', usuario);
    res.redirect('/logout'); // Redireciona para a rota de logout
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router