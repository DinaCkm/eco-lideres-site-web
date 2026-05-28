const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { sequelize, syncDB } = require('./database');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Railway fica atrás de proxy HTTPS. Isto permite que o Express grave cookies seguros corretamente.
app.set('trust proxy', 1);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'eco-blog-secret-2026',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  }
}));

// Arquivos estáticos do módulo novo: blog, admin, uploads e CSS do blog.
app.use(express.static(PUBLIC_DIR));

// Rotas dinâmicas do blog/admin/API.
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);

// Rota raiz: preserva o index.html original que já estava na raiz do repositório.
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Compatibilidade com o site antigo: páginas HTML que continuam na raiz do repositório.
app.get('/:page.html', (req, res, next) => {
  const fileName = req.params.page + '.html';
  const filePath = path.join(ROOT_DIR, fileName);

  if (!filePath.startsWith(ROOT_DIR)) return next();
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// Assets antigos que continuam na raiz do repositório.
app.use('/img', express.static(path.join(ROOT_DIR, 'img')));
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));
app.use('/css', express.static(path.join(ROOT_DIR, 'css')));
app.use('/js', express.static(path.join(ROOT_DIR, 'js')));

// 404 simples, com fallback seguro caso não exista public/404.html.
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'), (err) => {
    if (err) res.status(404).send('Not Found');
  });
});

// Iniciar servidor
syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ECO do B.E.M. rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar banco:', err);
  process.exit(1);
});
