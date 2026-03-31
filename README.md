# 🏆 Arena Torneios

Sistema web para gerenciamento de torneios, permitindo cadastro de usuários, organização de competições e controle de participantes.

---

## 🚀 Tecnologias utilizadas

### Back-end

* Node.js
* Express
* MongoDB (Mongoose)
* EJS (template engine)
* Express-session

### Front-end

* HTML, CSS
* Estrutura baseada em views

---

## 📂 Estrutura do projeto

```
arena-torneios/
│
├── Front-end/          # Interfaces do usuário
│   ├── views/
│   └── Usuario.html
│
├── back-end/           # API e lógica de negócio
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
│
├── diagramas/          # Diagramas UML (classes, estados, etc)
└── package.json
```

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```
git clone <url-do-repo>
cd arena-torneios
```

### 2. Instale as dependências

Back-end:

```
cd back-end
npm install
```

### 3. Configure o banco de dados

* Certifique-se de ter o MongoDB rodando
* Configure a string de conexão no projeto (mongoose)

### 4. Inicie o servidor

```
npm start
```

Servidor rodando em:

```
http://localhost:3000
```

---

## 🎯 Funcionalidades

* Cadastro de usuários
* Criação de torneios
* Gerenciamento de participantes
* Estrutura baseada em MVC

---

## 📊 Diagramas

O projeto inclui:

* Diagrama de classes
* Diagrama de pacotes
* Diagrama de máquina de estados

---

