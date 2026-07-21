const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { transformSiteHtml } = require('../site-transform');

function sendBlogFile(fileName) {
  return (req, res, next) => {
    const filePath = path.join(__dirname, '../../public', fileName);

    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) return next(err);
      res.type('html').send(transformSiteHtml(html));
    });
  };
}

// /blog → listagem
router.get('/', sendBlogFile('blog.html'));

// /blog/:slug → post individual
router.get('/:slug', sendBlogFile('blog-post.html'));

module.exports = router;
