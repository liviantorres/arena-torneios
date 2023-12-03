const mongoose = require('mongoose')

const Partida = mongoose.model('Partida', {
    data: String,
    horario: String,
    local: String,
    timeCasaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Time' // ou o nome do seu modelo Time
    },
    timeCasaBrasao: String,
    timeForaId: String,
    timeForaBrasao:String ,
    placarTimeCasa: Number,
    placarTimeFora: Number,
    jodadorPontuacao: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jogador'
    }],
    //horaMomentoPontuacao: String,
    qtdCartaoAmarelo: Number,
    qtdCartaoVermelho: Number,
    chutesAOGol: Number,
    qtdFalta: Number ,
    campeonatoId: String
})

module.exports = Partida