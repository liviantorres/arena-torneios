const router = require('express').Router();

const timeController = require('../controllers/TimeController')

router.post('/', timeController.criarTime)

router.patch('/:id', timeController.editarTime)

router.delete('/:id', timeController.excluirTime)

router.get('/', timeController.mostrarTime)

router.get('/:nome', timeController.mostrarTimePorNome)

module.exports = router