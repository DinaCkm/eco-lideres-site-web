const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Login — público
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, '../../public/admin/login.html'));
});

// Tudo mais no /admin requer autenticação
router.use(requireAuth);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
});

router.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
});

router.get('/posts/novo', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/editor.html'));
});

router.get('/posts/:id/editar', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/editor.html'));
});

router.get('/categorias', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
});

router.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
});

module.exports = router;
