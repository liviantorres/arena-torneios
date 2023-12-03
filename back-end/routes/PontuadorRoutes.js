const Partida = require('../models/Partida');

const router = require('express').Router();

router.get('/:idPartida/:timeId', async (req, res)=>{

    const partidaId = req.params.idPartida;


    try {
        const partida = await Partida.findById({_id: partidaId}).populate('jogadorPontuacao')

        res.render('./tela-partida/criarPontuador', {partida: partida})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erro no servidor"})
    }
})

router.get('/pontuadorTimeFora/:idPartida/:timeId', async (req, res)=>{
    const partidaId = req.params.idPartida;


    try {
        const partida = await Partida.findById({_id: partidaId}).populate('jogadorPontuacao')

        res.render('./tela-partida/criarPontuador2', {partida: partida})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erro no servidor"})
    }
})

module.exports = router