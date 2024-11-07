// index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./database/connection');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const query = 'SELECT * FROM tarefa';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.render('index', { tarefas: results });
  });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const { titulo, descricao, data_finalizacao } = req.body;
  const query = 'INSERT INTO tarefa (titulo, descricao, data_finalizacao) VALUES (?, ?, ?)';
  connection.query(query, [titulo, descricao, data_finalizacao || null], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/edit/:id', (req, res) => {
  const query = 'SELECT * FROM tarefa WHERE tarefa_id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('edit', { tarefa: results[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const { titulo, descricao, data_finalizacao } = req.body;
  const query = 'UPDATE tarefa SET titulo = ?, descricao = ?, data_finalizacao = ? WHERE tarefa_id = ?';
  connection.query(query, [titulo, descricao, data_finalizacao || null, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/delete/:id', (req, res) => {
  const query = 'DELETE FROM tarefa WHERE tarefa_id = ?';
  connection.query(query, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
