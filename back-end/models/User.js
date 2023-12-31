const mongoose = require('mongoose');

const User = mongoose.model('User', {
    nome: {type: String, unique: true},
    selectedAvatar: String,
    email: String,
    senha: String,
    campeonatos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campeonato'
    }]
})

module.exports = User