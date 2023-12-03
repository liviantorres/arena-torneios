
const Campeonato = require('../models/Campeonato')
const Partida = require('../models/Partida');
const Time = require('../models/Time');
const User = require('../models/User');

const criarCampeonato = async (req, res) => {
  const { nome, descricao, quantidade_times, premiacao, forma_competicao } = req.body;

  if (!nome || !descricao || !quantidade_times || !premiacao || !forma_competicao) {
    return res.status(422).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const usuarioEmail = req.session.user;
    const usuario = await User.findOne({ email: usuarioEmail });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    // Crie o campeonato
    const novoCampeonato = await Campeonato.create({
      nome,
      descricao,
      quantidade_times,
      premiacao,
      forma_competicao,
      usuarioId: usuario._id,
    });

    // Adicione partidas ao campeonato
    await adicionarPartidasAoCampeonato(novoCampeonato._id, quantidade_times);

    res.redirect('/campeonato');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Função para adicionar partidas ao campeonato
async function adicionarPartidasAoCampeonato(campeonatoId, quantidadeTimes) {
  const partidasVazias = gerarPartidasVazias(quantidadeTimes, campeonatoId);

  // Crie os registros no banco de dados para as partidas vazias
  const partidasCriadas = await Partida.insertMany(partidasVazias);

  // Atualize o campeonato com os IDs das partidas criadas
  await Campeonato.findByIdAndUpdate(campeonatoId, { $push: { partidas: { $each: partidasCriadas } } });
}

// Função para gerar partidas vazias com apenas o ID do campeonato
function gerarPartidasVazias(quantidadeTimes, campeonatoId) {
  const partidasVazias = [];
  
  for (let i = 0; i < quantidadeTimes - 1; i++) {
    for (let j = i + 1; j < quantidadeTimes; j++) {
      const partida = {
        campeonatoId,
        // Outras propriedades da partida, se necessário
      };
      partidasVazias.push(partida);
    }
  }

  return partidasVazias;
}


const excluirCampeonato = async (req, res) => {
    const id = req.params.id

    try {
        const campeonato = await Campeonato.findOne({_id: id})
        if(!campeonato){
            res.status(422).json({message: 'Campeonato não existe'})
            return
        }
        const timesCampeonato = await Time.find({campeonatoId: id})
        for( const time of timesCampeonato){
          await Time.deleteOne({_id: time._id})
        }

        const partidasCampeonato = await Partida.findOne({campeonatoId: id})
        for (const partida of partidasCampeonato){
          await Partida.deleteOne({_id: partida._id})
        }

        await campeonato.deleteOne({_id: id})
        res.redirect('./campeonato')

    } catch (error) {
        res.status(500).json({error: error})
    }
}

/*
const excluirCampeonato = async (req, res) => {
  const id = req.params.id;

  try {
      const campeonato = await Campeonato.findOne({ _id: id });

      if (!campeonato) {
          res.status(422).json({ message: 'Campeonato não existe' });
          return;
      }

      // Encontrar e excluir todos os times associados ao campeonato
      await Time.deleteMany({ campeonatoId: id });

      // Encontrar todas as partidas associadas ao campeonato
      const partidasCampeonato = await Partida.find({ campeonatoId: id });

      // Excluir todas as partidas associadas ao campeonato
      await partidasCampeonato.deleteMany({ campeonatoId: id });

      // Excluir o próprio campeonato
      await campeonato.deleteOne({ _id: id });

      res.status(200).json({ message: 'Campeonato removido com sucesso' });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};*/

const editarCampeonato = async (req, res) => {
  const campeonatoId = req.params.id;
  
  const { nome, descricao, quantidade_times, premiacao, forma_competicao } = req.body;

  try {
      // Verifique se o campeonato existe
      const campeonato = await Campeonato.findById(campeonatoId);

      if (!campeonato) {
          return res.status(404).json({ error: 'Campeonato não encontrado' });
      }

      // Atualize os campos do campeonato
      campeonato.nome = nome;
      campeonato.descricao = descricao;
      campeonato.quantidade_times = quantidade_times;
      campeonato.premiacao = premiacao;
      campeonato.forma_competicao = forma_competicao;

      // Salve as alterações no banco de dados
      await campeonato.save();

      res.status(200).json({ message: 'Campeonato editado com sucesso' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const mostrarCampeonatos = async (req, res)=>{
    try {
      const usuarioEmail = req.session.user//
      const usuario = await User.findOne({email: usuarioEmail});
      if(!usuario){
        return res.status(404).json({error: 'Usuário não encontrado!'})
      }
       const campeonato = await Campeonato.find({usuarioId: usuario._id});
       res.render('./tela_campeonato/infoCampeonato', { campeonato: campeonato });
       //res.render('./tela_campeonato/infoCampeonato');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const mostrarCampeonatosPorNome = async (req, res)=>{
}


module.exports = {criarCampeonato, excluirCampeonato, editarCampeonato, mostrarCampeonatos, mostrarCampeonatosPorNome }