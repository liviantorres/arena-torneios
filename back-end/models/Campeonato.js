const mongoose = require('mongoose')

const Campeonato = mongoose.model('Campeonato', {
    nome: String,
    descricao: String,
    quantidade_times: Number,
    premiacao: String,
    forma_competicao: String,
    times: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Time'
    }]
    /*partidas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partida'
    }]*/
})

module.exports = Campeonato