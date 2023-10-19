const mongoose = require('mongoose');

const User = mongoose.model('User', {
    nome: {type: String, unique: true},
    email: String,
    senha: String
})

module.exports = User