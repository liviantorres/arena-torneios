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

module.exports = router