
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const userRoutes = require('./routes/userRoutes')
const jogadorRoutes = require('./routes/JogadorRoutes')
const timeRoutes = require('./routes/TimeRoutes')
const campeonatoRoutes = require('./routes/CampeonatoRoutes')
const partidaRoutes = require('./routes/PartidaRoutes')
const pontuadorRoutes = require('./routes/PontuadorRoutes')

const verificaAutenticacao = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
};


app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    name:'session',
    secret: 'livianm',
    maxAge: 24 * 60 * 60 * 1000, 
    saveUninitialized: true
}));
  
app.use(express.static(path.join(__dirname, '../Front-end/imagens')));

app.set("view engine", "ejs");
app.set("views", "../Front-end/views");

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.use('/usuario', verificaAutenticacao, userRoutes)
app.use('/jogador', verificaAutenticacao, jogadorRoutes)
app.use('/time', verificaAutenticacao, timeRoutes)
app.use('/campeonato', verificaAutenticacao, campeonatoRoutes)
app.use('/partida', verificaAutenticacao, partidaRoutes)
app.use('/pontuador', verificaAutenticacao, pontuadorRoutes)


app.get('/', (req, res) =>{
    if(req.session.login){
        res.render('teste')
    }
    else{
        res.render('./tela-login', {error: ''})
    }
})

const User = require('./models/User');
app.post('/', async (req, res) => {

    if(req.session.user){
        res.redirect('./campeonato')
        return
    }else{
        const {email, senha} = req.body

        if(!email){

        // res.status(422).json({error: 'O email é obrigatório!'})
            res.render('./tela-login', {error: "O email é obrigatório"})
            return
        }else if(!senha){
            res.render('./tela-login', {error: 'A senha é obrigatório!'})
            return
        }

        // Checar se o usuario existe
        const user = await User.findOne({email});
        if(!user){
            //return res.status(400).json({message: 'Usuário não existe no sistema'})
            res.render('./tela-login', {error: 'Usuário não existe no sistema'})
            return
        }
        if(user.senha != senha){
            //return res.status(400).json({message: 'Senha Inválida'})
            res.render('./tela-login', {error: 'Senha Inválida'})
            return
        }

        try {
            req.session.user = email
            req.session.save()
            res.redirect('./campeonato')
            //res.render('teste', {login: email})
            //return res.status(201).json({message: 'Usuário entrou!'})
        } catch (error) {
            res.status(500).json({ message: 'Erro no serviddor' });
        }
}

})

app.get('/register', (req, res)=>{
    res.render('./tela-registro', {error: ''})
})

app.post('/register', async (req, res) => {
    
    const {nome, email, senha} = req.body

    if(!nome){
        res.render('./tela-registro', {error: "O nome é obrigatório"})
        return
    }else if(!email){
        res.render('./tela-registro', {error: 'O email é obrigatório!'})
        return
    }else if(!senha){
        res.render('./tela-registro', {error: 'A senha é obrigatória!'})
        return
    }
    const selectedAvatar = 'http://localhost:3000/avatar1.png'

    try {
            const user = await User.findOne({email});
            if(user){
                return res.render('./tela-registro', {error: 'Email já cadastrado'})
            }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }

    const user = {
        nome, email, senha, selectedAvatar
    }

    try {
        await User.create(user)
        res.redirect('/')
    } catch (error) {
        res.status(500).json({error: error})
    }
})

app.get('/logout', (req, res) => {

    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao fazer logout');
      } else {
        res.redirect('/');
      }
    });
});

app.get('/sobre-nos', (req, res)=>{
    res.render('./telasobre')
})

app.get('/contato', (req, res)=>{
    res.render('./telacontato')
})

const DB_USER = 'livian';
const DB_PASSWORD = encodeURIComponent('qb6VGWopKAjkIexc')

mongoose
.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.wnhclvd.mongodb.net/arena-toneios?retryWrites=true&w=majority`)
.then( () => {
    console.log("Conectou ao MongoDB");
    app.listen(3000);
})
.catch((err) => console.log(err))


