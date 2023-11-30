const router = require('express').Router();

const campeonatoController = require('../controllers/CampeonatoController')

const Campeonato = require('../models/Campeonato')
const Partida = require('../models/Partida')
const Time = require('../models/Time')

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

router.post('/criar-campeonato', campeonatoController.criarCampeonato)

router.get('/editar-campeonato/:id', async (req, res) => {
  const campeonatoId = req.params.id

    try {
        // Verifique se o campeonato existe
        const campeonato = await Campeonato.findById(campeonatoId);

        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }

        // Renderize a página EJS com o formulário de edição e os detalhes do campeonato
        res.render('./tela_campeonato/editarCampeonato', { error: null, campeonato });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/editar-campeonato/:id', async (req, res) => {
    const campeonatoId = req.params.id;
    
    const { nome, descricao, quantidade_times, premiacao, forma_competicao } = req.body;
  
    try {
        // Verifique se o campeonato existe
        const campeonato = await Campeonato.findById(campeonatoId);
  
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
  
        // Atualize os campos do campeonato
        campeonato.nome = nome;
        campeonato.descricao = descricao;
        campeonato.quantidade_times = quantidade_times;
        campeonato.premiacao = premiacao;
        campeonato.forma_competicao = forma_competicao;
  
        // Salve as alterações no banco de dados
        await campeonato.save();
  
        res.redirect('/campeonato')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const campeonato = await Campeonato.findOne({ _id: id });

        if (!campeonato) {
            res.status(422).json({ message: 'Campeonato não existe' });
            return;
        }

        await Time.deleteMany({ campeonatoId: id });
        await Partida.deleteMany({ campeonatoId: id });
        await campeonato.deleteOne({ _id: id });

        res.redirect('/campeonato');

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', campeonatoController.editarCampeonato)

router.get('/', campeonatoController.mostrarCampeonatos)

router.get('/:nome', campeonatoController.mostrarCampeonatosPorNome)

router.get('/exibirCampeonato/:id', async (req, res)=>{
    try {
        const campeonato = await Campeonato.findById(req.params.id).populate('times');
        res.render('./tela_campeonato/campeonatos', {campeonato: campeonato})
    } catch (error) {
        res.status(500).json({message: "Erro no servidor"})
    }
    
})

router.delete('/:campeonatoId/times', async (req, res) => {
    const campeonatoId = req.params.campeonatoId;

    try {
        // Encontre o campeonato pelo ID
        const campeonato = await Campeonato.findById(campeonatoId);

        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado.' });
        }

        // Obtenha os IDs dos times associados ao campeonato
        const timeIds = campeonato.times.map(time => time._id);

        // Exclua todos os jogadores associados a esses times
        await Time.updateMany({ _id: { $in: timeIds } }, { $set: { jogadores: [] } });

        // Exclua todos os times associados a este campeonato no banco de dados
        await Time.deleteMany({ _id: { $in: timeIds } });

        // Remova todos os times associados a este campeonato no objeto campeonato
        campeonato.times = [];
        await campeonato.save();

        res.redirect('/campeonatos');
    } catch (error) {
        console.error('Erro ao excluir times e jogadores do campeonato:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router

