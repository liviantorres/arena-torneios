const mongoose = require('mongoose')

const Jogador = mongoose.model('Jogador', {
    nome: String,
    timeId: String
})

module.exports = Jogador