const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { sequelize, syncDB } = require('./database');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { transformSiteHtml } = require('./site-transform');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const HOME_FILE = path.join(ROOT_DIR, 'index.html');

const MOBILE_MENU = `
  <div class="eco-mobile-menu" id="ecoMobileMenu">
    <div class="eco-mobile-section">
      <a href="index.html#sobre-nos" class="eco-mobile-link eco-mobile-main-link">Sobre Nós</a>
      <a href="/blog" class="eco-mobile-link eco-mobile-main-link">Blog</a>
      <a href="clientes.html" class="eco-mobile-link eco-mobile-main-link">🔐 Área de Clientes</a>
    </div>

    <div class="eco-mobile-section eco-mobile-submenu">
      <a href="solucoes-empresas.html" class="eco-mobile-section-title">Soluções para Empresas</a>
      <a href="solucoes-empresas.html" class="eco-mobile-link eco-mobile-submenu-link">🧭 Visão geral das soluções</a>
      <a href="eco-lideres.html" class="eco-mobile-link eco-mobile-submenu-link">🎯 ECO Líderes</a>
      <a href="eco-disc-360.html" class="eco-mobile-link eco-mobile-submenu-link">🧠 ECO DISC 360</a>
      <a href="eco-times.html" class="eco-mobile-link eco-mobile-submenu-link">👥 ECO Times</a>
      <a href="plataforma-pdi.html" class="eco-mobile-link eco-mobile-submenu-link">📊 Plataforma de PDI</a>
      <a href="bem-nr1.html" class="eco-mobile-link eco-mobile-submenu-link">⚖️ BEM NR-1</a>
      <a href="convenio-corporativo.html" class="eco-mobile-link eco-mobile-submenu-link">🤝 Convênio Corporativo</a>
      <a href="projetos-personalizados.html" class="eco-mobile-link eco-mobile-submenu-link">🛠️ Projetos Personalizados</a>
    </div>

    <div class="eco-mobile-section">
      <a href="mercado-publico.html" class="eco-mobile-link eco-mobile-main-link">Mercado Público</a>
      <a href="para-voce.html" class="eco-mobile-link eco-mobile-main-link">Desenvolvimento Individual</a>
    </div>

    <a href="index.html#contato" class="eco-mobile-cta">Fale Conosco</a>
  </div>`;

function addPublicMarketMenu(html) {
  const desktopHasMarket = /<a\b(?=[^>]*href=["']mercado-publico\.html["'])(?=[^>]*class=["'][^"']*eco-nav-link[^"']*["'])/i.test(html);
  if (desktopHasMarket) return html;

  const desktopLink = '      <a href="mercado-publico.html" class="eco-nav-link">Mercado Público</a>\n';
  let transformed = html;

  transformed = transformed.replace(
    /(\s*<a\b[^>]*href=["']para-voce\.html["'][^>]*class=["'][^"']*eco-nav-link[^"']*["'][^>]*>)/i,
    `\n${desktopLink}$1`
  );

  if (!/<a\b(?=[^>]*href=["']mercado-publico\.html["'])(?=[^>]*class=["'][^"']*eco-nav-link[^"']*["'])/i.test(transformed)) {
    transformed = transformed.replace(
      /(\s*<a\b[^>]*href=["'](?:index\.html)?#contato["'][^>]*class=["'][^"']*eco-nav-link[^"']*["'][^>]*>)/i,
      `\n${desktopLink}$1`
    );
  }

  return transformed;
}

function normalizeMobileMenu(html) {
  if (!/id=["']ecoMobileMenu["']/i.test(html)) return html;

  return html.replace(
    /\s*<div\b(?=[^>]*id=["']ecoMobileMenu["'])[^>]*>[\s\S]*?<\/div>\s*(?=<main\b)/i,
    `\n${MOBILE_MENU}\n\n  `
  );
}

function addMenuHierarchyStyles(html) {
  if (html.includes('css/menu-hierarquia.css')) return html;

  return html.replace(
    '</head>',
    '  <link rel="stylesheet" href="css/menu-hierarquia.css">\n</head>'
  );
}

function renderSiteHtml(html, options = {}) {
  const transformed = transformSiteHtml(html, options);
  const withDesktopMenu = addPublicMarketMenu(transformed);
  const withMobileMenu = normalizeMobileMenu(withDesktopMenu);
  return addMenuHierarchyStyles(withMobileMenu);
}

function sendTransformedHtml(filePath, options = {}) {
  return (req, res, next) => {
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) return next(err);
      res.type('html').send(renderSiteHtml(html, options));
    });
  };
}

const sendHome = sendTransformedHtml(HOME_FILE, { isHome: true });

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

// Rota raiz: preserva o index.html original e aplica os ajustes institucionais.
app.get(['/', '/index.html'], sendHome);

// Compatibilidade com o site antigo: páginas HTML que continuam na raiz do repositório.
app.get('/:page.html', (req, res, next) => {
  const fileName = req.params.page + '.html';
  const filePath = path.join(ROOT_DIR, fileName);

  if (!filePath.startsWith(ROOT_DIR)) return next();

  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) return next();
    res.type('html').send(renderSiteHtml(html));
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
