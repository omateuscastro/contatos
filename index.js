const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/categorias", function(req, res) {
  res.render("categorias/categorias");
});

app.get("/categorias/novo", function(req, res) {
  let mensagens = [];

  res.render("categorias/novo", { mensagens });
});

app.listen(3000);