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

router.get('/teste', (req, res)=>{
    res.render('./teste', {login: req.session.user})
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

//router.post('/editar-campeonato', campeonatoController.editarCampeonato)

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


//router.delete('/:id', campeonatoController.excluirCampeonato)
/*
router.delete('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const campeonato = await Campeonato.findOne({_id: id})
        if(!campeonato){
            res.status(422).json({message: 'Campeonato não existe'})
            return
        }
        const timesCampeonato = await Time.find({campeonatoId: id})
        for( const time of timesCampeonato){
          await Time.deleteOne({_id: time._id})
        }

        const partidasCampeonato = await Partida.findOne({campeonatoId: id})
        for (const partida of partidasCampeonato){
          await Partida.deleteOne({_id: partida._id})
        }

        await campeonato.deleteOne({_id: id})
        res.status(200).json({message: 'Campeonato removido com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }
})
*/
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const campeonato = await Campeonato.findOne({ _id: id });

        if (!campeonato) {
            res.status(422).json({ message: 'Campeonato não existe' });
            return;
        }

        // Remover times associados ao campeonato
        await Time.deleteMany({ campeonatoId: id });

        // Remover partidas associadas ao campeonato
        await Partida.deleteMany({ campeonatoId: id });

        // Remover o próprio campeonato
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
        const idCampeonato = req.params.id

        const campeonato = await Campeonato.findById(req.params.id).populate('times');
        

        //const campeonato = await Campeonato.findOne({_id: idCampeonato});
        res.render('./tela_campeonato/campeonatos', {campeonato: campeonato})
    } catch (error) {
        res.status(500).json({message: "Erro no servidor"})
    }
    
})

module.exports = router

