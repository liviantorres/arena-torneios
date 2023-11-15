const router = require('express').Router();

const campeonatoController = require('../controllers/CampeonatoController')

const verificaAutenticacao = (req, res, next) => {
    // Verifique se o usuário está autenticado
    if (req.session.user) {
      // Se estiver autenticado, continue com a solicitação
      next();
    } else {
      // Se não estiver autenticado, redirecione para a página de login
      res.redirect('/login');
    }
  };

router.get('criar-campeonato', (req, res) => {
    res.render('./teste')
})

router.get('/teste', verificaAutenticacao, (req, res)=>{
    res.render('./teste', {login: req.session.user})
})

router.post('/criar-campeonato', campeonatoController.criarCampeonato)

router.delete('/:id', campeonatoController.excluirCampeonato)

router.patch('/:id', campeonatoController.editarCampeonato)

router.get('/', campeonatoController.mostrarCampeonatos)

router.get('/:nome', campeonatoController.mostrarCampeonatosPorNome)

module.exports = router

