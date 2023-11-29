const router = require('express').Router();
const Time = require('../models/Time')

const timeController = require('../controllers/TimeController')

router.post('/:id', timeController.criarTime)

router.patch('/:id', timeController.editarTime)

//router.delete('/:id', timeController.excluirTime)

router.get('/', timeController.mostrarTime)

//router.get('/:nome', timeController.mostrarTimePorNome)

router.post('/editar-time/:id', async (req, res) => {
    const timeId = req.params.id;
    
    const { nome, abreviacao} = req.body;
  
    try {
        // Verifique se o campeonato existe
        const time = await Time.findById(timeId);
  
        if (!time) {
            return res.status(404).json({ error: 'Time não encontrado' });
        }
  
        time.nome = nome;
        time.abreviacao = abreviacao;
       // time.brasao = brasao;

        // Salve as alterações no banco de dados
        await time.save();
  
        res.render('./tela_campeonato/exibirTime', {time: time})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res)=>{
    try {
        //const idTime = req.params.id

        const time = await Time.findById(req.params.id).populate('jogadores');
        
        res.render('./tela_campeonato/exibirTime', {time: time})
    } catch (error) {
        res.status(500).json({message: "Erro no servidor"})
    }
})

module.exports = router