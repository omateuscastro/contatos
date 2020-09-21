const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('./bd/conexao');
const Categorias = require('./bd/Categorias');
const Contatos = require('./bd/Contatos');
const formataData = require('./public/js/util');

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
              res.render("categorias/categorias", { categorias,
                  mensagem: "Não foi possível, pois já há um contato relacionado a esta categoria."});
          else
              res.render("categorias/categorias", { categorias, mensagem: ""});
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


app.get("/contatos/lista", function (req, res) {
  Contatos
      .findAll({ order: ["nome"], include: [{ model: Categorias }] })
      .then(function (contatos) {
          res.render("contatos/contatos", { contatos: contatos, formataData: formataData });
      });
});

app.get("/contatos/novo/:mensagem?", function (req, res) {
  Categorias
      .findAll({ order: ["descricao"] })
      .then(function (categorias) {
          if (req.params.mensagem)
              res.render("contatos/novo", { mensagem: "Contato incluído.", categorias: categorias });
          else
              res.render("contatos/novo", { mensagem: "", categorias: categorias });
      });
});

app.post("/contatos/salvar", function (req, res) {
  let nome = req.body.nome;
  let email = req.body.email;
  let nascimento = req.body.nascimento;
  let categoria = req.body.categoria;
  Contatos
      .create({ nome: nome, email: email, nascimento: nascimento, categoriaId: categoria })
      .then(
          res.redirect("/contatos/novo/incluido")
      );
});

app.get("/contatos/editar/:id", function (req, res) {
  let id = req.params.id;
  Contatos
      .findByPk(id)
      .then(function (contato) {
          Categorias.findAll()
              .then(function (categorias) {
                  res.render("contatos/editar", { contato: contato, categorias: categorias, formataData: formataData });
              })
      });
});

app.post("/contatos/atualizar", function (req, res) {
  let id = req.body.id;
  let nome = req.body.nome;
  let email = req.body.email;
  let nascimento = req.body.nascimento;
  let categoria = req.body.categoria;
  Contatos
      .update({ nome: nome, email: email, nascimento: nascimento, categoriaId: categoria }, { where: { id: id } })
      .then(function () {
          res.redirect("/contatos/lista");
      });
});

app.get("/contatos/excluir/:id", function (req, res) {
  let id = req.params.id;
  Contatos
      .destroy({ where: { id: id } })
      .then(function () {
          res.redirect("/contatos/lista");
      })
});

app.listen(3000);