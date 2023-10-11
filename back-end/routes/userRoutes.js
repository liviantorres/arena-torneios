const router = require('express').Router();


const User = require('../models/User')

// Create - Criar usuario
router.post('/', async (req, res) => {
    const {nome, email, senha} = req.body

    if(!nome){
        res.status(422).json({error: 'O nome é obrigatório!'})
    }else if(!email){
        res.status(422).json({error: 'O email é obrigatório!'})
    }else if(!senha){
        res.status(422).json({error: 'A senha é obrigatória!'})
    };


    const user = {
        nome, email, senha
    }

    try {
        //criando dados 
        await User.create(user)

        res.status(201).json({message: "Pessoa Inserida com sucesso"})

    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Read 
router.get('/', async (req, res) => {
 try {
    const usuario = await User.find();
    res.status(200).json(usuario)

 } catch (error) {
    res.status(500).json({ error: error })
 }
})

router.get('/:id', async (req, res)=>{
    const id = req.params.id

    try {
        const usuario = await User.findOne({_id: id});
        
        if (!usuario) {
            res.status(422).json({ message: 'O usuário não foi encontrado' })
            return
        }

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// Update
router.patch('/:id', async (req, res)=>{

    const id = req.params.id
    const { nome, email, senha } = req.body

    const usuario = {
        nome, email, senha
    }

    try {
        
        const updateUser = await User.updateOne({_id:id}, usuario)
        
        if(updateUser.matchedCount === 0){
            res.status(422).json({ message: 'O usuário não foi encontrado' })
            return
        }
        
        res.status(200).json(usuario)

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Delete
router.delete('/:id', async (req, res)=>{
    const id = req.params.id

    const usuario = await User.findOne({_id: id})
    
    if (!usuario) {
        res.status(422).json({ message: 'O usuário não foi encontrado' })
        return
    }

    try {

        await User.deleteOne({_id: id})

        res.status(200).json({message: "usuário removido com sucesso!"})
        
    } catch (error) {
        res.status(500).json({ error: error })
    }
})



module.exports = router