const router = require('express').Router();

const jogadorController = require('../controllers/JogadorController')

router.post('/', jogadorController.criarJogador)

router.patch('/:id', jogadorController.editarJogador)

router.delete('/:id', jogadorController.excluirJogador)

module.exports = router