const router = require('express').Router();

const Campeonato = require('../models/Campeonato');
const Partida = require('../models/Partida')
const Time = require('../models/Time')
const Pontuador = require('../models/Pontuador')

router.post('/criarPontuador/:idPartida/:timeId', async (req, res) => {

    const partidaId = req.params.idPartida;
    const timeId = req.params.timeId;
    const { nomeJogador, horaMomentoPontuacao } = req.body;

    try {
        
        const partida = await Partida.findById(partidaId);
        if (!partida) {
            return res.status(404).json({ message: "Partida não encontrada" });
        }

        const campeonato = await Campeonato.findById(partida.campeonatoId);
        if (!campeonato) {
            return res.status(404).json({ message: "Campeonato não encontrado" });
        }

        
        const pontuador = new Pontuador({
            nomeJogador: nomeJogador,
            horaMomentoPontuacao: horaMomentoPontuacao,
            partidaId: partidaId,
            timeId: timeId
        });

    
        await pontuador.save();

        partida.jogadorPontuacao.push(pontuador._id);
        await partida.save();

        if(timeId == partida.timeCasaId){
            res.redirect(`/pontuador/${partida._id}/${timeId}`);
        }else{
            res.redirect(`/pontuador/pontuadorTimeFora/${partida._id}/${timeId}`);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
})


router.get('/:idCampeonato/exibirPartidas', async (req, res) => {
    const idCampeonato = req.params.idCampeonato;

    try {
        const campeonato = await Campeonato.findById({ _id: idCampeonato }).populate('partidas');
        res.render('./tela-partida/partidas', { campeonato: campeonato});
      
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

router.post('/editar-campeonato/:id', async (req, res) => {
    const campeonatoId = req.params.id;
    
    const { nome, descricao, quantidade_times, premiacao, forma_competicao } = req.body;
  
    try {

        const campeonato = await Campeonato.findById(campeonatoId);
  
        if (!campeonato) {
            return res.status(404).json({ error: 'Campeonato não encontrado' });
        }
  
        campeonato.nome = nome;
        campeonato.descricao = descricao;
        campeonato.quantidade_times = quantidade_times;
        campeonato.premiacao = premiacao;
        campeonato.forma_competicao = forma_competicao;
  
        await campeonato.save();
  
        res.redirect('/campeonato')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/editarPartidaExistente/:idPartida', async (req, res)=>{
    const partidaId = req.params.idPartida;
    
    try {
        const partida = await Partida.findById(partidaId);

        const { data, horario, local, timeCasaId, timeForaId, chutesAOGol, placarTimeCasa, placarTimeFora, qtdCartaoAmarelo, qtdCartaoVermelho, qtdFalta } = req.body;

        const timeCasa = await Time.findById({_id: timeCasaId})
        const timeCasaBrasao = timeCasa.brasao

        const timeFora = await Time.findById({_id: timeForaId})
        const timeForaBrasao = timeFora.brasao

        partida.data = data;
        partida.horario = horario;
        partida.local = local;

        partida.timeCasaId = timeCasaId;
        partida.timeCasaBrasao = timeCasaBrasao;

        partida.timeForaId = timeForaId;
        partida.timeForaBrasao = timeForaBrasao;

        partida.chutesAOGol = chutesAOGol;
        partida.placarTimeCasa = placarTimeCasa;
        partida.placarTimeFora = placarTimeFora;
        partida.qtdCartaoAmarelo = qtdCartaoAmarelo;
        partida.qtdCartaoVermelho = qtdCartaoVermelho;
        partida.qtdFalta = qtdFalta;
      


        await partida.save();

        
        res.redirect(`/partida/${partida.campeonatoId}/exibirPartidas`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no servidor" });
    }

});

router.get('/editarPartida/:idPartida', async (req, res)=>{
    const partidaId = req.params.idPartida;

    try {
        const partida = await Partida.findById(partidaId);
        const campeonato = await Campeonato.findOne({ 'partidas': partidaId }).populate('times');

        res.render('./tela-partida/criarPartida', {campeonato: campeonato, partida: partida});

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }

    
});

module.exports = router