// config inicial
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    name:'session',
    secret: 'livianm',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    saveUninitialized: true
}));
  
app.use(express.static(path.join(__dirname, '../Front-end/imagens')));

app.set("view engine", "ejs");
app.set("views", "../Front-end/views");

//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);
// Middleware para verificar autenticação
const verificaAutenticacao = (req, res, next) => {
    // Verifique se o usuário está autenticado
    if (req.session.user) {
      // Se estiver autenticado, continue com a solicitação
      next();
    } else {
      // Se não estiver autenticado, redirecione para a página de login
      res.redirect('/login');
    }
  };
  
 /* // Rota protegida que usa o middleware de verificação de autenticação
  app.get('/restrito', verificaAutenticacao, (req, res) => {
    res.send('Esta é uma rota protegida!');
  });
*/

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
app.post('/', (req, res) =>{
    if(req.session.login){
        res.render('teste')
    }
    else{
        res.render('./tela-login')
    }
})

const User = require('./models/User');
app.post('/', async (req, res) => {
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
        req.session.user = email
        req.session.save()
        res.redirect('/testa')
        //res.render('teste', {login: email})
        //return res.status(201).json({message: 'Usuário entrou!'})
    } catch (error) {
        res.status(500).json({ message: 'Erro no serviddor' });
    }

})

app.get('/testa', verificaAutenticacao, async (req, res)=>{
     res.render('teste', {login: req.session.user})
})

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


