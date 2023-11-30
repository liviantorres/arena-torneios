
const Time = require('../models/Time')
const Jogador = require('../models/Jogador')
const Campeonato = require('../models/Campeonato')

const criarTime = async (req, res)=>{

    const campeonatoId = req.params.id

    const {nome, abreviacao, brasao} = req.body

    if(!nome){
        res.status(422).json({error: 'O nome é obrigatório!'})
        return
    }else if(!brasao){
        res.status(422).json({error: 'O brasao é obrigatório!'})
        return
    }else if(!abreviacao){
        res.status(422).json({error: 'A abreviacao do time é obrigatória!'})
        return
    }else if(!campeonatoId){
        res.status(422).json({error: 'O campeonato do time é obrigatória!'})
       return
    }

    try{

        const campeonato = await Campeonato.findOne({_id: campeonatoId}) 
        if(!campeonato){
            res.status(422).json({message: 'Campeonato não encontrado'})
            return
        }

        const time = new Time({
            nome,
            brasao,
            abreviacao,
            campeonatoId
        })

        
        await time.save()
        campeonato.times.push(time)
        await campeonato.save()
        res.redirect(`/campeonato/exibirCampeonato/${campeonatoId}`)

    }catch(erro){
        res.status(500).json({error: 'Erro no servidor'})
    }

   
}

const editarTime = async (req, res) => {
    const id = req.params.id
    const {nome, logoContainer, abreviacao, campeonatoId} = req.body

    try {

        const time = await Time.findOne({_id: id})
        if(!time){
            res.status(422).json({message: 'O time não foi encontrado'})
            return
        }

        const campeonatoOrigem = await Campeonato.findOne({_id: time.campeonatoId})
        let campeonatoDestino = null

        if(campeonatoId){
            campeonatoDestino = await Campeonato.findOne({_id: campeonatoId})

            campeonatoOrigem.times.pull(time._id)
            await campeonatoOrigem.save()

            if(!campeonatoDestino){
                res.status(422).json({message: 'Campeonato Destino não encontrado'})
                return
            }
        }


        time.nome = nome
        time.brasao = logoContainer
        time.abreviacao = abreviacao

        if(campeonatoId){
            time.campeonatoId = campeonatoId
            campeonatoDestino.times.push(time)
            await campeonatoDestino.save()
        }


        await time.save()

        res.status(200).json(time)
        
    } catch (error) {
        res.status(500).json({ error: error})
    }
}

const excluirTime = async (req, res)=> {
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
}

const mostrarTime = async (req, res) => {
    try {
       const time = await Time.find();
       res.status(200).json(time)
   
    } catch (error) {
       res.status(500).json({ error: error })
    }
}

const mostrarTimePorNome = async (req, res) => {
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
}

module.exports = {criarTime, editarTime, excluirTime, mostrarTime, mostrarTimePorNome}