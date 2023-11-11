// config inicial
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({secret:'teste'}));

const path = require('path');

const mongoose = require('mongoose');


app.use(express.static(path.join(__dirname, '../Front-end/imagens')));

app.set("view engine", "ejs");
app.set("views", "../Front-end/views");

//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

// rotas api
const userRoutes = require('./routes/userRoutes')
const jogadorRoutes = require('./routes/JogadorRoutes')
const timeRoutes = require('./routes/TimeRoutes')
const campeonatoRoutes = require('./routes/CampeonatoRoutes')
const partidaRoutes = require('./routes/PartidaRoutes')

app.use('/usuario', userRoutes)
app.use('/jogador', jogadorRoutes)
app.use('/time', timeRoutes)
app.use('/campeonato', campeonatoRoutes)
app.use('/partida' , partidaRoutes)

// rota inicial 
app.get('/login', (req, res) => {
    res.render('./tela-login')
})
/*
const User = require('./models/User');

app.post('/login', async (req, res)=>{

    const email = req.body.login
    const senha = req.body.senha

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: 'Usuário não existe no sistema'})
    }
    if(user.senha != senha){
        return res.status(400).json({message: 'Senha Inválida'})
    }

    try {
        res.redirect('/usuario')
    } catch (error) {
        res.status(500).json({ message: 'Erro no serviddor' });
    }

    res.render('./tela-registro')
})*/

// entregar uma porta
const DB_USER = 'livian';
const DB_PASSWORD = encodeURIComponent('qb6VGWopKAjkIexc')

mongoose
.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.wnhclvd.mongodb.net/arena-toneios?retryWrites=true&w=majority`)
.then( () => {
    console.log("Conectou ao MongoDB");
    app.listen(3000);
})
.catch((err) => console.log(err))


