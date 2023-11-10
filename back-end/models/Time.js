const mongoose = require('mongoose')

const Time = mongoose.model('Time', {
    nome: String,
    brasao: String,
    abreviacao: String,
    jogadores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogador'
    }], 
    campeonatoId: String
})

module.exports = Time