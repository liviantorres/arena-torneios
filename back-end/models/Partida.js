const mongoose = require('mongoose')

const Partida = mongoose.model('Partida', {
    data: String,
    horario: String,
    local: String,
    timeCasaId: String,
    timeForaId: String,
    premiacao: String,
    formaCompeticao: String,
    placarTimeCasa: Number,
    placarTimeFora: Number,
    jodadorPontuacao: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jogador'
    }],
    horaMomentoPontuacao: String,
    qtdCartaoAmarelo: Number,
    qtdCartaoVermelho: Number,
    qtdFalta: Number ,
    campeonatoId: String
})

module.exports = Partida