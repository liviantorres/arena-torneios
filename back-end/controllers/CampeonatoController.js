
const Campeonato = require('../models/Campeonato')
const Partida = require('../models/Partida');
const Time = require('../models/Time');

const criarCampeonato = async (req, res) => {
    const { nome, descricao, quantidade_times, premiacao, forma_competicao } = req.body;
  
    if (!nome || !descricao || !quantidade_times || !premiacao || !forma_competicao) {
      return res.status(422).json({ error: 'Todos os campos são obrigatórios' });
    }
  console.log("Testeeee")
    const campeonato = {
      nome,
      descricao,
      quantidade_times,
      premiacao,
      forma_competicao,
    };
  
    try {
      await Campeonato.create(campeonato);
      res.status(201).json({ message: 'Campeonato criado' });
    } catch (error) {
      res.status(500).json({ error: error });
    }
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
        res.status(200).json({message: 'Campeonato removido com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }
}

const editarCampeonato = async (req, res) => {

}

const mostrarCampeonatos = async (req, res)=>{
}

const mostrarCampeonatosPorNome = async (req, res)=>{
}


module.exports = {criarCampeonato, excluirCampeonato, editarCampeonato, mostrarCampeonatos, mostrarCampeonatosPorNome }