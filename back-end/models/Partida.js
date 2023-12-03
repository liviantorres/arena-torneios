const mongoose = require('mongoose')

const Partida = mongoose.model('Partida', {
    data: String,
    horario: String,
    local: String,
    timeCasaId: String,
    timeCasaBrasao: String,
    timeForaId: String,
    timeForaBrasao:String ,
    placarTimeCasa: Number,
    placarTimeFora: Number,
    jogadorPontuacao: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pontuador'
    }],
    //horaMomentoPontuacao: String,
    qtdCartaoAmarelo: Number,
    qtdCartaoVermelho: Number,
    chutesAOGol: Number,
    qtdFalta: Number ,
    campeonatoId: String
})

module.exports = Partida