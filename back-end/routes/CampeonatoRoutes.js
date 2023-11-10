const router = require('express').Router();

const campeonatoController = require('../controllers/CampeonatoController')

router.post('/criar-campeonato', campeonatoController.criarCampeonato)

router.delete('/:id', campeonatoController.excluirCampeonato)

router.patch('/:id', campeonatoController.editarCampeonato)

router.get('/', campeonatoController.mostrarCampeonatos)

router.get('/:nome', campeonatoController.mostrarCampeonatosPorNome)

module.exports = router

