const router = require('express').Router();


const User = require('../models/User')

// Registrar Usuario
router.post('/register', async (req, res) => {
    const {nome, email, senha} = req.body

    if(!nome){
        res.status(422).json({error: 'O nome é obrigatório!'})
        return
    }else if(!email){
        res.status(422).json({error: 'O email é obrigatório!'})
        return
    }else if(!senha){
        res.status(422).json({error: 'A senha é obrigatória!'})
        return
    }


    // Verifica se o email já existe no sistema
    try {
            const user = await User.findOne({email});
            if(user){
                return res.json({message: 'Email já cadastrado'})
            }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }

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


// Verifica Login do Usuário
router.post('/login', async (req, res) => {
    const {email, senha} = req.body

    if(!email){
        res.status(422).json({error: 'O nome é obrigatório!'})
        return
    }else if(!senha){
        res.status(422).json({error: 'O email é obrigatório!'})
        return
    }

    // Checar se o usuario existe
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: 'Usuário não existe no sistema'})
    }
    if(user.senha != senha){
        return res.status(400).json({message: 'Senha Inválida'})
    }

    try {
        return res.status(201).json({message: 'Usuário entrou!'})
    } catch (error) {
        res.status(500).json({ message: 'Erro no serviddor' });
    }

})



// Mostrar Usuários 
router.get('/', async (req, res) => {
 try {
    const usuario = await User.find();
    res.status(200).json(usuario)

 } catch (error) {
    res.status(500).json({ error: error })
 }
})

// Mostrar Usuário por ID
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

// Atualizar Usuários
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

//Deletar Usuários
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