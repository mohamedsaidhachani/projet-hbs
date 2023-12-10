const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'news'
});

connection.connect();

var hbs = require('express-hbs');

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.get("/", (req, res) => {
  const sql = "SELECT * FROM actualites ORDER BY date_publication DESC";

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des actualités');
    } else {
      res.render('index', { news: results });
    }
  });
});

app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views/add.html"));
});

app.get("/addnews", function(req, res) {
  const untitre = req.query.letitre;
  const unedesc = req.query.ladescription;
  const sql = "INSERT INTO actualites(title, desciption) VALUES (?, ?)";

  connection.query(sql, [untitre, unedesc], function(error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur lors de l\'ajout de l\'actualité');
    } else {
      res.send('Actualité ajoutée avec succès');
    }
  });
});

app.listen(port, () => {
  console.log(`Application en cours d'écoute sur le port ${port}`);
});
