const mongoose = require('mongoose')

const Jogador = mongoose.model('Jogador', {
    nome: String,
    posicao: String,
    timeId: String
})

module.exports = Jogador