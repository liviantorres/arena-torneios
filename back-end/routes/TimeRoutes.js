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

// Excluir Time

//Mostrar Times 

//Mostrartime por nome

module.exports = router