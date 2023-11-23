const router = require('express').Router();

const campeonatoController = require('../controllers/CampeonatoController')

const Campeonato = require('../models/Campeonato')

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

router.get('/criar-campeonato', (req, res) => {
    res.render('./criaCampeonatoTeste', {error: null})
})

router.get('/teste', (req, res)=>{
    res.render('./teste', {login: req.session.user})
})

router.post('/criar-campeonato', campeonatoController.criarCampeonato)

router.get('/editar-campeonato', async (req, res) => {
  const campeonatoId = req.query.campeonato;

    try {
        // Verifique se o campeonato existe
        const campeonato = await Campeonato.findById(campeonatoId);

        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }

        // Renderize a página EJS com o formulário de edição e os detalhes do campeonato
        res.render('./editaCampeonatoTeste', { error: null, campeonato });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/editar-campeonato', campeonatoController.editarCampeonato)


router.delete('/:id', campeonatoController.excluirCampeonato)

router.patch('/:id', campeonatoController.editarCampeonato)

router.get('/', campeonatoController.mostrarCampeonatos)

router.get('/:nome', campeonatoController.mostrarCampeonatosPorNome)

module.exports = router

