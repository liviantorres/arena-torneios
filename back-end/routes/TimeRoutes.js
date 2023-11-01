const router = require('express').Router();

const Time = require('../models/Time')
const Jogador = require('../models/Jogador')


// Criar Time
router.post('/criar-time', async (req, res)=>{

    const {nome, brasao, abreviacao} = req.body

    if(!nome){
        res.status(422).json({error: 'O nome é obrigatório!'})
        return
    }else if(!brasao){
        res.status(422).json({error: 'O brasao é obrigatório!'})
        return
    }else if(!abreviacao){
        res.status(422).json({error: 'A abreviacao do time é obrigatória!'})
        return
    }

    try{
        const time = new Time({
            nome,
            brasao,
            abreviacao,
        })
        

        await time.save()
        res.status(201).json({message: "Time criado"})

    }catch(erro){
        res.status(500).json({error: 'Erro no servidor'})
    }

   
})

// Editar Time
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const {nome, brasao, abreviacao, } = req.body

    try {

        const time = await Time.findOne({_id: id})
        if(!time){
            res.status(422).json({message: 'O time não foi encontrado'})
            return
        }

        time.nome = nome
        time.brasao = brasao
        time.abreviacao = abreviacao

        await time.save()

        res.status(200).json(time)
        
    } catch (error) {
        res.status(500).json({ error: error})
    }
})

// Excluir Time
router.delete('/:id', async (req, res)=> {
    const id = req.params.id
    try {
        const time = await Time.findOne({_id: id})
        if(!time){
            res.status(422).json({message: 'Time não encontrado'})
            return
        }

        const jogadoresTime = await Jogador.find({timeId: id})
        for (const jogador of jogadoresTime){
            await Jogador.deleteOne({_id: jogador._id})
        }

        await time.deleteOne({_id: id})
        res.status(200).json({message: 'Time removido com sucesso'})
    
    } catch (error) {
        res.status(500).json({error: error})
    }
})


//Mostrar Times 
router.get('/', async (req, res) => {
    try {
       const time = await Time.find();
       res.status(200).json(time)
   
    } catch (error) {
       res.status(500).json({ error: error })
    }
})

//Mostrar time por nome
router.get('/:nome', async (req, res) => {
    const nome = req.params.nome

    try {
        
       const time = await Time.findOne({nome: nome});
        if(!time){
            res.status(422).json('time não encontrado')
            return
        }

       res.status(200).json(time)
   
    } catch (error) {
       res.status(500).json({ error: error })
    }
})


module.exports = router