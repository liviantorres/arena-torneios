const Jogador = require('../models/Jogador')
const Time = require('../models/Time')

const criarJogador = async (req, res) => {
    
    try {
      const { nome, timeId } = req.body;
  
        if(!nome){
            res.status(422).json({error: 'O nome é obrigatório!'})
            return
        }else if(!timeId){
            res.status(422).json({error: 'O Id do time é obrigatório!'})
            return
        }
      
      try{ 
            const time = await Time.findOne({_id: timeId}).populate('jogadores')
            const jogador = new Jogador({
                nome,
                timeId: timeId,
              });
          
              await jogador.save();
              time.jogadores.push(jogador);
              await time.save();
          
              res.render('./tela-jogador', {time: time});

      }catch(erro){
        return res.status(404).json({ message: 'Time não encontrado' });
      }
    
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor' });
    }
}

const editarJogador = async (req, res)=>{

    const id = req.params.id
    const { nome, timeId } = req.body
  
  
    try {
        
        const jogador = await Jogador.findOne({_id: id})
        
        if(!jogador){
            res.status(422).json({ message: 'O jogador não foi encontrado' })
            return
        }
  
        const timeOrigem = await Time.findOne({_id: jogador.timeId})
        let timeDestino = null
  
        if(timeId){
          timeDestino = await Time.findOne({ _id: timeId })
  
          timeOrigem.jogadores.pull(jogador._id)
          await timeOrigem.save()
  
          if(!timeDestino){
            res.status(422).json({message: 'Time destino não encontrado'})
            return
          }
        }
  
        jogador.nome = nome
  
        if (timeId) {
          jogador.timeId = timeId;
          timeDestino.jogadores.push(jogador);
          await timeDestino.save();
        }
  
        await jogador.save()
  
        
        res.status(200).json(jogador)
  
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const excluirJogador = async (req, res) => {
    const id = req.params.id 
  
    try {
  
      const jogador = await Jogador.findOne({_id:id})
  
      if(!jogador){
        res.status(422).json({message: 'Jogador não encontrado'})
        return
      }
  
      const timeJogador = await Time.findOne({_id: jogador.timeId}).populate('jogadores')
  
      if(timeJogador){
        timeJogador.jogadores.pull(jogador._id)
        await timeJogador.save()
      }
  
      await Jogador.deleteOne({_id: id})
      res.redirect(`/jogador/${timeId}`)
      
    } catch (error) {
      res.status(500).json({error: error})
    }
}

module.exports = {criarJogador, editarJogador, excluirJogador}