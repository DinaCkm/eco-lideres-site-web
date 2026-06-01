const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'railway',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

// ─── MODELO: User (admin) ───────────────────────────────────────────────────
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false }
}, { tableName: 'users', timestamps: true });

// ─── MODELO: Category ──────────────────────────────────────────────────────
const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(80), unique: true, allowNull: false },
  slug: { type: DataTypes.STRING(80), unique: true, allowNull: false },
  color: { type: DataTypes.STRING(20), defaultValue: 'purple' }
}, { tableName: 'categories', timestamps: false });

// ─── MODELO: Post ──────────────────────────────────────────────────────────
const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  cover_url: { type: DataTypes.STRING(500), allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
  reading_time: { type: DataTypes.INTEGER, defaultValue: 5 },
  seo_title: { type: DataTypes.STRING(70), allowNull: true },
  seo_description: { type: DataTypes.STRING(160), allowNull: true },
  published_at: { type: DataTypes.DATE, allowNull: true },
  category_id: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'posts', timestamps: true });

// Associações
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
Category.hasMany(Post, { foreignKey: 'category_id' });
User.hasMany(Post, { foreignKey: 'author_id' });

// ─── SYNC + SEED ────────────────────────────────────────────────────────────
async function syncDB() {
  await sequelize.authenticate();
  await sequelize.sync(); // não altera tabelas automaticamente em produção

  // Criar admin padrão se não existir
  const bcrypt = require('bcryptjs');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecodobem.com';
  const adminPass  = process.env.ADMIN_PASSWORD || 'EcoBem@2026';
  const exists = await User.findOne({ where: { email: adminEmail } });
  if (!exists) {
    const hash = await bcrypt.hash(adminPass, 12);
    await User.create({ email: adminEmail, password: hash, name: 'Admin ECO' });
    console.log(`Admin criado: ${adminEmail}`);
  }

  // Criar categorias padrão se tabela vazia
  const catCount = await Category.count();
  if (catCount === 0) {
    await Category.bulkCreate([
      { name: 'Liderança', slug: 'lideranca', color: 'purple' },
      { name: 'PDI', slug: 'pdi', color: 'teal' },
      { name: 'Psicologia Organizacional', slug: 'psicologia-organizacional', color: 'green' },
      { name: 'DISC', slug: 'disc', color: 'gold' },
      { name: 'Gestão de Pessoas', slug: 'gestao-de-pessoas', color: 'purple' },
      { name: 'Cases e Resultados', slug: 'cases-resultados', color: 'teal' }
    ]);
    console.log('Categorias padrão criadas');
  }
}

module.exports = { sequelize, User, Post, Category, syncDB };
