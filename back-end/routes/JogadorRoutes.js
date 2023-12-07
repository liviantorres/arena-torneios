const router = require('express').Router();
const Time = require('../models/Time')
const Jogador = require('../models/Jogador')

const jogadorController = require('../controllers/JogadorController')

router.post('/', jogadorController.criarJogador)

router.patch('/:id', jogadorController.editarJogador)

router.put('/:id', async (req, res) => {
    try {
      const jogadorId = req.params.id;
      const { novoNome } = req.body; // Substitua 'novoNome' pelos campos que você deseja editar

      // Verifica se o jogador existe
      const jogador = await Jogador.findById(jogadorId);
      if (!jogador) {
        return res.status(404).json({ mensagem: 'Jogador não encontrado' });
      }

      // Atualiza as informações do jogador
      jogador.nome = novoNome; // Atualize conforme necessário

      // Salva as alterações no banco de dados
      await jogador.save();
      
      const time = await Time.findById(jogador.timeId).populate('jogadores');

      return res.render('./tela-jogador', {time: time});
    } catch (error) {
      console.error('Erro ao editar jogador:', error);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
})


router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const jogador = await Jogador.findOne({ _id: id });

    if (!jogador) {
      res.status(422).json({ message: 'Jogador não encontrado' });
      return;
    }

    const timeJogador = await Time.findOne({ _id: jogador.timeId }).populate('jogadores');

    if (timeJogador) {
      timeJogador.jogadores.pull(jogador._id);
      await timeJogador.save();
    }

    await Jogador.deleteOne({ _id: id });
    res.redirect(`/jogador/${timeJogador._id}`);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get('/:id', async (req, res)=>{
    const timeId = req.params.id;

  try {
    const time = await Time.findById(timeId).populate('jogadores');
    
    if (!time) {
      return res.status(404).json({ error: 'Time não encontrado.' });
    }

    res.render('./tela-jogador', { time: time });
  } catch (error) {
    console.error('Erro ao obter detalhes do time:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
})


router.post('/criar-jogador/:id', async (req, res) => {
  const timeId = req.params.id

    try{ 
      const { nome } = req.body;
      const time = await Time.findOne({_id: timeId})
      const jogador = new Jogador({
          nome,
          timeId: timeId,
      });
      
      await jogador.save();
      time.jogadores.push(jogador);
      await time.save();

      res.redirect(`/jogador/${timeId}`);

  }catch(erro){
  return res.status(404).json({ message: 'Time não encontrado' });
  }
})


router.post('/', async (req, res) => {
   // const timeId = req.params.id
 
    try{ 
        const { nome , timeId } = req.body;
        const time = await Time.findOne({_id: timeId})
        const jogador = new Jogador({
            nome,
            timeId: timeId,
        });
        
        await jogador.save();
        time.jogadores.push(jogador);
        await time.save();
    
        res.render('./tela-jogador', {jogador: jogador});

    }catch(erro){
    return res.status(404).json({ message: 'Time não encontrado' });
    }
})






module.exports = router