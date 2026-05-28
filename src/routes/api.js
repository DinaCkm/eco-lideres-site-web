const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');
const { Op } = require('sequelize');
const { Post, Category, User } = require('../database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// ── Upload de imagem ────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// ── Helper: slug único ──────────────────────────────────────────────────────
async function uniqueSlug(title, excludeId = null) {
  let base = slugify(title, { lower: true, strict: true, locale: 'pt' });
  let slug = base;
  let i = 1;
  while (true) {
    const where = { slug };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    const exists = await Post.findOne({ where });
    if (!exists) break;
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ── Helper: tempo de leitura ────────────────────────────────────────────────
function calcReadingTime(html) {
  const text = html.replace(/<[^>]+>/g, '');
  return Math.ceil(text.split(/\s+/).length / 200) || 1;
}

// ══════════════════════════════════════════════════════════════════════════════
// ROTAS PÚBLICAS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/posts — listagem pública
router.get('/posts', async (req, res) => {
  try {
    const { categoria, busca, page = 1, limit = 9 } = req.query;
    const where = { status: 'published' };

    if (categoria) {
      const cat = await Category.findOne({ where: { slug: categoria } });
      if (cat) where.category_id = cat.id;
    }
    if (busca) {
      where[Op.or] = [
        { title: { [Op.like]: `%${busca}%` } },
        { excerpt: { [Op.like]: `%${busca}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['published_at', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['content'] }
    });

    res.json({
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/posts/recentes — para a home
router.get('/posts/recentes', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: 'published' },
      include: [{ model: Category, as: 'category' }],
      order: [['published_at', 'DESC'], ['createdAt', 'DESC']],
      limit: 3,
      attributes: { exclude: ['content'] }
    });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/posts/:slug — post individual público
router.get('/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug, status: 'published' },
      include: [{ model: Category, as: 'category' }, { model: User, as: 'author', attributes: ['name'] }]
    });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    // Posts relacionados
    const related = await Post.findAll({
      where: {
        status: 'published',
        id: { [Op.ne]: post.id },
        ...(post.category_id ? { category_id: post.category_id } : {})
      },
      include: [{ model: Category, as: 'category' }],
      order: [['published_at', 'DESC']],
      limit: 3,
      attributes: { exclude: ['content'] }
    });

    res.json({ post, related });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/categorias
router.get('/categorias', async (req, res) => {
  try {
    const cats = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(cats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ROTAS ADMIN (requerem autenticação)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/admin/me — sessão atual
router.get('/admin/me', requireAuth, (req, res) => {
  res.json({ id: req.session.userId, name: req.session.userName });
});

// GET /api/admin/dashboard
router.get('/admin/dashboard', requireAuth, async (req, res) => {
  try {
    const [total, published, drafts, categories] = await Promise.all([
      Post.count(),
      Post.count({ where: { status: 'published' } }),
      Post.count({ where: { status: 'draft' } }),
      Category.count()
    ]);
    const recentes = await Post.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 5,
      include: [{ model: Category, as: 'category' }],
      attributes: { exclude: ['content'] }
    });
    res.json({ total, published, drafts, categories, recentes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/posts
router.get('/admin/posts', requireAuth, async (req, res) => {
  try {
    const { status, busca, page = 1 } = req.query;
    const where = {};
    if (status && status !== 'todos') where.status = status;
    if (busca) where.title = { [Op.like]: `%${busca}%` };

    const limit = 20;
    const offset = (parseInt(page) - 1) * limit;
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
      attributes: { exclude: ['content'] }
    });
    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/posts/:id
router.get('/admin/posts/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }]
    });
    if (!post) return res.status(404).json({ error: 'Não encontrado' });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/posts — criar
router.post('/admin/posts', requireAuth, async (req, res) => {
  try {
    let { title, content, excerpt, cover_url, status, category_id, seo_title, seo_description } = req.body;

    const cleanContent = sanitizeHtml(content || '', {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
      allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'style', 'id'], 'iframe': ['src', 'allowfullscreen', 'frameborder'] }
    });

    const slug = await uniqueSlug(title);
    const reading_time = calcReadingTime(cleanContent);

    const post = await Post.create({
      title: title.trim(),
      slug,
      content: cleanContent,
      excerpt: excerpt?.trim() || '',
      cover_url: cover_url || null,
      status: status || 'draft',
      category_id: category_id || null,
      seo_title: seo_title?.trim() || null,
      seo_description: seo_description?.trim() || null,
      reading_time,
      author_id: req.session.userId,
      published_at: status === 'published' ? new Date() : null
    });

    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/admin/posts/:id — editar
router.put('/admin/posts/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Não encontrado' });

    let { title, content, excerpt, cover_url, status, category_id, seo_title, seo_description } = req.body;

    const cleanContent = sanitizeHtml(content || '', {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'iframe']),
      allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'style', 'id'], 'iframe': ['src', 'allowfullscreen', 'frameborder'] }
    });

    const slug = title !== post.title ? await uniqueSlug(title, post.id) : post.slug;
    const reading_time = calcReadingTime(cleanContent);

    await post.update({
      title: title.trim(),
      slug,
      content: cleanContent,
      excerpt: excerpt?.trim() || '',
      cover_url: cover_url || null,
      status: status || 'draft',
      category_id: category_id || null,
      seo_title: seo_title?.trim() || null,
      seo_description: seo_description?.trim() || null,
      reading_time,
      published_at: status === 'published' && !post.published_at ? new Date() : post.published_at
    });

    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/posts/:id
router.delete('/admin/posts/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Não encontrado' });
    await post.destroy();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/upload — imagem
router.post('/admin/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// GET /api/admin/categorias
router.get('/admin/categorias', requireAuth, async (req, res) => {
  try {
    const cats = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(cats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/categorias
router.post('/admin/categorias', requireAuth, async (req, res) => {
  try {
    const { name, color } = req.body;
    const slug = slugify(name, { lower: true, strict: true, locale: 'pt' });
    const cat = await Category.create({ name: name.trim(), slug, color: color || 'purple' });
    res.status(201).json(cat);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/categorias/:id
router.delete('/admin/categorias/:id', requireAuth, async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/usuarios
router.get('/admin/usuarios', requireAuth, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'createdAt'] });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/usuarios
router.post('/admin/usuarios', requireAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: hash });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (e) {
    res.status(400).json({ error: 'E-mail já em uso ou dados inválidos' });
  }
});

// DELETE /api/admin/usuarios/:id
router.delete('/admin/usuarios/:id', requireAuth, async (req, res) => {
  try {
    if (req.params.id == req.session.userId) {
      return res.status(400).json({ error: 'Não é possível excluir o usuário atual' });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
