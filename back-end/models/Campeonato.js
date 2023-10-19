const mongoose = require('mongoose')

const Campeonato = mongoose.model('Campeonato', {
    nome: String,
    descricao: String,
    quantidade_times: int,
    premiacao: String,
    forma_competicao: String,
    
})

module.exports = Campeonato