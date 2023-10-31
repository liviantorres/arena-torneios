const router = require('express').Router();

const Jogador = require('../models/Jogador')
const Time = require('../models/Time')

// Criar jogador
router.post('/criar-jogador', async (req, res) => {
    try {
      const { nome, posicao, timeId } = req.body;
  
        if(!nome){
            res.status(422).json({error: 'O nome é obrigatório!'})
            return
        }else if(!posicao){
            res.status(422).json({error: 'A posicao é obrigatório!'})
            return
        }else if(!timeId){
            res.status(422).json({error: 'O Id do time é obrigatório!'})
            return
        }
      
      try{ 
            const time = await Time.findOne({_id: timeId})
            const jogador = new Jogador({
                nome,
                posicao,
                timeId: timeId, // Use o ID do time
              });
          
              await jogador.save();
              time.jogadores.push(jogador);
              await time.save();
          
              res.status(201).json({ message: 'Jogador inserido com sucesso' });

      }catch(erro){
        return res.status(404).json({ message: 'Time não encontrado' });
      }
    
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

// Editar Jogador
router.patch('/:id', async (req, res)=>{

  const id = req.params.id
  const { nome, posicao, timeId } = req.body


  try {
      
      const jogador = await Jogador.findOne({_id: id})
      
      if(!jogador){
          res.status(422).json({ message: 'O jogador não foi encontrado' })
          return
      }

      const timeOrigem = await Time.findOne({_id: jogador.timeId})
      const timeDestino = await Time.findOne({_id: timeId})

      if(!timeOrigem || !timeDestino){
        res.status(422).json({message: 'Time de origem ou destino não encontrado'})
        return
      }

      timeOrigem.jogadores.pull(jogador._id)
      await timeOrigem.save()

      jogador.nome = nome
      jogador.posicao = posicao
      jogador.timeId = timeId
      await jogador.save()

      timeDestino.jogadores.push(jogador._id)
      await timeDestino.save()
      
      res.status(200).json(jogador)

  } catch (error) {
      res.status(500).json({ error: error })
  }
})


// Excluir Jogador
router.delete('/:id', async (req, res) => {
  const id = req.params.id 
  const jogador = await Jogador.findOne({_id:id})

  if(!jogador){
    res.status(422).json({message: 'Jogador não encontrado'})
  }
  try {
    await Jogador.deleteOne({_id: id})
    res.status(200).json({message: 'Jogador removido com sucesso'})
    
  } catch (error) {
    res.status(500).json({error: error})
  }

})

module.exports = router