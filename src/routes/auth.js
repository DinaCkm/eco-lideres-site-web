const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../database');
const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.redirect('/admin/login?erro=credenciais');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.redirect('/admin/login?erro=credenciais');
    }
    req.session.userId = user.id;
    req.session.userName = user.name;
    res.redirect('/admin');
  } catch (e) {
    console.error(e);
    res.redirect('/admin/login?erro=servidor');
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
});

module.exports = router;
