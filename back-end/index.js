// config inicial
const express = require('express');
const app = express();

const mongoose = require('mongoose');

//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

// rotas api
const userRoutes = require('./routes/userRoutes')

app.use('/usuario', userRoutes)

// rota inicial / endpoint
app.get('/', (req, res) => {

    res.json({ message: 'Oi express'})

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


