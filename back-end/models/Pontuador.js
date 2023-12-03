const mongoose = require('mongoose');

const Pontuador = mongoose.model('Pontuador', {
    nomeJogador: {type: String, unique: true},
    horaMomentoPontuacao: String,
    partidaId: String,
    timeId: String
})

module.exports = Pontuador