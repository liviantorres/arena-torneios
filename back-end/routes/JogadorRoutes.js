const router = require('express').Router();
const Time = require('../models/Time')
const Jogador = require('../models/Jogador')

const jogadorController = require('../controllers/JogadorController')

router.post('/', jogadorController.criarJogador)

router.patch('/:id', jogadorController.editarJogador)

router.delete('/:id', jogadorController.excluirJogador)

router.get('/:id', async (req, res)=>{
    const timeId = req.params.id
    try {
        // Encontre o time pelo ID
        const time = await Time.findOne({ _id: timeId });

        if (!time) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }

        // Encontre todos os jogadores que pertencem a este time
        const jogadoresDoTime = await Jogador.find({ time: time._id });

        res.render('./tela-jogador', { jogadores: jogadoresDoTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
const mostrarCampeonatos = async (req, res)=>{
    try {
      const usuarioEmail = req.session.user//
      const usuario = await User.findOne({email: usuarioEmail});
      if(!usuario){
        return res.status(404).json({error: 'Usuário não encontrado!'})
      }
       const campeonato = await Campeonato.find({usuarioId: usuario._id});
       res.render('./tela_campeonato/infoCampeonato', { campeonato: campeonato });
       //res.render('./tela_campeonato/infoCampeonato');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = router