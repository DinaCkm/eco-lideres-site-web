const express = require('express');
const path = require('path');
const router = express.Router();

// /blog → listagem
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/blog.html'));
});

// /blog/:slug → post individual
router.get('/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/blog-post.html'));
});

module.exports = router;
