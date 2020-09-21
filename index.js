const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('./bd/conexao');
const Categorias = require('./bd/Categorias');
const Contatos = require('./bd/Contatos');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

conexao.authenticate();

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/categorias/lista/:mensagem?", function (req, res) {
  Categorias
      .findAll({ order: ["descricao"] }) 
      .then(function (categorias) {
          if(req.params.mensagem)
              res.render("categorias/categorias", { categorias: categorias,
                  mensagem: "Não foi possível, pois já há um contato relacionado a esta categoria."});
          else
              res.render("categorias/categorias", { categorias: categorias, mensagem: ""});
      });
});

app.get("/categorias/novo", function (req, res) {
  res.render("categorias/novo", { mensagem: '' });
});

app.post("/categorias/salvar", function (req, res) {
  let descricao = req.body.descricao;
  Categorias.create({
    descricao
  }).then(res.render("categorias/novo", { mensagem: "Categoria Incluída." }))
})

app.get("/categorias/editar/:id", function (req, res) {
  let id = req.params.id;
  Categorias
      .findByPk(id)
      .then(function (categoria) {
          res.render("categorias/editar", { categoria: categoria });
      });
});

app.post("/categorias/atualizar", function (req, res) {
  let id = req.body.id;
  let descricao = req.body.descricao;
  Categorias
      .update({ descricao: descricao }, { where: { id: id } })
      .then(function () {
          res.redirect("/categorias/lista");
      });
});

app.get("/categorias/excluir/:id", function (req, res) {
  let id = req.params.id;
  Categorias
      .destroy({ where: { id: id } })
      .then(function () {
          res.redirect("/categorias/lista");
      })
      .catch(function(erro){
          if(erro instanceof Sequelize.ForeignKeyConstraintError) {
              res.redirect("/categorias/lista/erro");
          }
      });
});


app.get("/contatos", function (req, res) {
  res.render("contatos/contatos");
});

app.get("/contatos/novo", function (req, res) {
  let mensagens = [];

  res.render("contatos/novo", { mensagens });
});

app.listen(3000);