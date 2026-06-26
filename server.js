const path = require('path');
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');

const { applySecurityHeaders } = require('./config/security');
const { initializeDatabase } = require('./config/database');
const curriculoController = require('./controllers/curriculoController');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

function escapeHtml(value) {
  const text = String(value ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// O encoding contextual acontece nas views com <%- escapeHtml(...) %>.
// O helper abaixo converte caracteres perigosos para entidades HTML antes da renderização.
app.locals.escapeHtml = escapeHtml;

initializeDatabase();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(applySecurityHeaders);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  maxAge: '0'
}));

app.get('/', curriculoController.listar);
app.get('/curriculos', curriculoController.listar);
app.get('/curriculos/novo', curriculoController.formularioNovo);
app.post('/curriculos', curriculoController.criar);
app.get('/curriculos/:id', curriculoController.detalhar);

app.use((req, res) => {
  res.status(404).render('curriculos/erro404', {
    title: 'Página não encontrada'
  });
});

app.use((error, req, res, next) => {
  console.error('Erro inesperado na aplicação:', error);
  res.status(500).render('curriculos/erro404', {
    title: 'Erro interno'
  });
});

app.listen(port, () => {
  console.log(`Aplicação disponível em http://localhost:${port}`);
});