const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(3000);