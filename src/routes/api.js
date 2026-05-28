<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Editor — ECO do B.E.M.</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css"/>
  <style>
    :root{
      --purple:#5B2EFF;--purple-deep:#1A0A5E;--teal:#00B8D9;--gold:#F59E0B;--green:#5ED38C;
      --bg:#0f0a2e;--surface:rgba(255,255,255,.05);--border:rgba(255,255,255,.1);
      --muted:rgba(255,255,255,.5);--radius:14px;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:#fff;min-height:100vh;}

    /* TOPBAR */
    .topbar{
      position:sticky;top:0;z-index:100;
      background:rgba(20,9,58,.95);backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border);
      display:flex;align-items:center;gap:12px;padding:12px 24px;
    }
    .topbar-left{display:flex;align-items:center;gap:10px;flex:1;}
    .back-btn{
      display:inline-flex;align-items:center;gap:6px;padding:8px 12px;
      border-radius:9px;background:rgba(255,255,255,.07);border:1px solid var(--border);
      color:var(--muted);font-size:13px;cursor:pointer;text-decoration:none;
      transition:all .15s;
    }
    .back-btn:hover{color:#fff;background:rgba(255,255,255,.12);}
    .page-label{font-family:'Poppins',sans-serif;font-weight:700;font-size:16px;}
    .topbar-right{display:flex;gap:8px;}
    .btn{
      display:inline-flex;align-items:center;gap:6px;
      padding:9px 18px;border-radius:10px;font-family:'Poppins',sans-serif;
      font-weight:600;font-size:13.5px;cursor:pointer;border:none;
      transition:transform .15s;text-decoration:none;
    }
    .btn-ghost{background:rgba(255,255,255,.07);color:rgba(255,255,255,.8);border:1px solid var(--border);}
    .btn-ghost:hover{background:rgba(255,255,255,.12);color:#fff;}
    .btn-gold{background:rgba(245,158,11,.15);color:var(--gold);border:1px solid rgba(245,158,11,.3);}
    .btn-gold:hover{background:rgba(245,158,11,.25);}
    .btn-primary{background:var(--purple);color:#fff;box-shadow:0 4px 14px rgba(91,46,255,.3);}
    .btn-primary:hover{transform:translateY(-1px);}
    .btn-danger{background:rgba(239,68,68,.16);color:#ffb4b4;border:1px solid rgba(239,68,68,.4);}
    .btn-danger:hover{background:rgba(239,68,68,.24);}
    .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;}

    /* LAYOUT */
    .layout{display:grid;grid-template-columns:1fr 320px;gap:0;height:calc(100vh - 57px);}
    .editor-col{padding:24px;overflow-y:auto;border-right:1px solid var(--border);}
    .sidebar-col{padding:20px;overflow-y:auto;background:rgba(0,0,0,.15);}

    /* CAMPOS */
    .field{margin-bottom:18px;}
    .field label{display:block;font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);margin-bottom:7px;}
    input[type=text],input[type=url],textarea,select{
      width:100%;padding:11px 14px;
      background:rgba(255,255,255,.07);border:1px solid var(--border);
      border-radius:10px;color:#fff;font-family:'Inter',sans-serif;font-size:14px;
      transition:border-color .2s;
    }
    input:focus,textarea:focus,select:focus{outline:none;border-color:var(--teal);}
    input::placeholder,textarea::placeholder{color:rgba(255,255,255,.3);}
    select option{background:#14093a;color:#fff;}
    .char-count{font-size:11px;color:var(--muted);text-align:right;margin-top:4px;}
    .char-count.warn{color:var(--gold);}
    .char-count.over{color:#ef4444;}

    /* TITLE */
    #titleInput{
      font-family:'Poppins',sans-serif;font-size:24px;font-weight:700;
      padding:14px 16px;letter-spacing:-.01em;
    }

    /* QUILL */
    #editorContainer{border-radius:10px;overflow:hidden;border:1px solid var(--border);}
    .ql-toolbar.ql-snow{
      background:rgba(255,255,255,.06)!important;
      border:none!important;border-bottom:1px solid var(--border)!important;
      padding:10px 12px!important;
    }
    .ql-container.ql-snow{
      border:none!important;
      background:#ffffff!important;
      font-family:'Inter',sans-serif!important;
      font-size:16px!important;
      min-height:500px;
    }
    .ql-editor{
      color:#1f2937!important;
      background:#ffffff!important;
      min-height:500px;
      padding:28px 34px!important;
      line-height:1.85!important;
    }
    .ql-editor.ql-blank::before{color:#9ca3af!important;}
    .ql-editor h1,.ql-editor h2,.ql-editor h3{
      font-family:'Poppins',sans-serif;
      color:#1A0A5E!important;
    }
    .ql-editor a{color:#5B2EFF!important;text-decoration:underline!important;}
    .ql-editor img.eco-image{
      display:block;
      max-width:100%;
      height:auto;
      margin:24px auto;
      border-radius:14px;
      cursor:pointer;
    }
    .ql-editor img.eco-image.is-selected{
      outline:3px solid var(--teal);
      outline-offset:4px;
    }
    .ql-editor figure.eco-post-image{
      display:block;
      margin:24px auto;
      max-width:100%;
    }
    .ql-editor figure.eco-post-image img{
      width:100%;
      max-width:100%;
      height:auto;
    }
    .ql-snow .ql-picker{color:rgba(255,255,255,.75)!important;}
    .ql-snow .ql-picker.ql-align .ql-picker-label::before,
    .ql-snow .ql-picker.ql-align .ql-picker-item::before{color:rgba(255,255,255,.85)!important;}
    .ql-snow .ql-stroke{stroke:rgba(255,255,255,.7)!important;}
    .ql-snow .ql-fill{fill:rgba(255,255,255,.7)!important;}
    .ql-snow.ql-toolbar button:hover .ql-stroke,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke{stroke:#fff!important;}
    .ql-snow.ql-toolbar button:hover .ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-fill{fill:#fff!important;}
    .ql-picker-options{background:#1a0a5e!important;border:1px solid var(--border)!important;}
    .ql-picker-item{color:#fff!important;}

    /* SIDEBAR PANELS */
    .panel{
      background:var(--surface);border:1px solid var(--border);
      border-radius:var(--radius);padding:16px;margin-bottom:14px;
    }
    .panel-title{font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}

    /* STATUS */
    .status-toggle{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
    .status-opt{
      padding:9px;border-radius:9px;border:1px solid var(--border);
      background:transparent;color:var(--muted);cursor:pointer;
      font-family:'Inter',sans-serif;font-size:13px;font-weight:600;text-align:center;
      transition:all .15s;
    }
    .status-opt.active.draft{background:rgba(245,158,11,.2);border-color:var(--gold);color:var(--gold);}
    .status-opt.active.published{background:rgba(94,211,140,.2);border-color:var(--green);color:var(--green);}

    /* COVER */
    .cover-preview{
      width:100%;aspect-ratio:16/9;border-radius:10px;overflow:hidden;
      background:rgba(255,255,255,.05);border:2px dashed var(--border);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      margin-bottom:10px;position:relative;
    }
    .cover-preview img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;}
    .cover-placeholder{text-align:center;color:var(--muted);font-size:13px;}
    .cover-placeholder .icon{font-size:28px;margin-bottom:6px;}
    .cover-actions{display:flex;gap:8px;margin-top:8px;}
    .help-text{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.45;}
    .content-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 12px;}
    .embed-preview-note{font-size:12px;color:var(--muted);line-height:1.5;margin-top:8px;}
    .html-textarea{
      min-height:420px;
      font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;
      font-size:13px;
      line-height:1.55;
      color:#e5e7eb;
      background:#0f0a2e;
      border:1px solid rgba(255,255,255,.18);
      border-radius:12px;
      padding:14px;
      resize:vertical;
    }
    .ql-editor .eco-embed-wrapper{
      position:relative;
      width:100%;
      max-width:760px;
      margin:32px auto;
      aspect-ratio:16/9;
      border-radius:16px;
      overflow:hidden;
      background:#111827;
      box-shadow:0 8px 32px rgba(26,10,94,.12);
    }
    .ql-editor .eco-embed-wrapper iframe{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      border:0;
      display:block;
    }
    .ql-editor iframe{
      max-width:100%;
    }
    .ql-editor div[style]{
      max-width:100%;
    }
    .ql-editor[data-raw-html="true"]{
      outline:3px solid rgba(0,184,217,.25);
      outline-offset:-3px;
    }

    /* MODAL */
    .modal-overlay{
      display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:999;
      align-items:center;justify-content:center;padding:20px;
    }
    .modal-card{
      width:min(540px,92vw);background:#14093a;border:1px solid rgba(255,255,255,.16);
      border-radius:18px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.45);
    }
    .modal-card h3{font-family:'Poppins',sans-serif;font-size:18px;margin-bottom:16px;}
    .modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .modal-check{display:flex;gap:8px;align-items:center;margin:4px 0 18px;color:rgba(255,255,255,.82);font-size:14px;}
    .modal-check input{width:auto;}
    .modal-actions{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;}
    .modal-actions-right{display:flex;gap:10px;}

    /* TOAST */
    #toast{
      position:fixed;bottom:20px;right:20px;z-index:1000;
      padding:11px 18px;border-radius:10px;font-size:14px;font-weight:600;
      box-shadow:0 6px 20px rgba(0,0,0,.4);
      transform:translateY(60px);opacity:0;transition:all .3s;pointer-events:none;
    }
    #toast.show{transform:translateY(0);opacity:1;}
    #toast.success{background:#10b981;color:#fff;}
    #toast.error{background:#ef4444;color:#fff;}
    #toast.info{background:var(--purple);color:#fff;}

    @media(max-width:900px){
      .layout{grid-template-columns:1fr;height:auto;}
      .sidebar-col{border-top:1px solid var(--border);}
      .modal-grid{grid-template-columns:1fr;}
    }
  </style>
</head>
<body>

<div class="topbar">
  <div class="topbar-left">
    <a href="/admin" class="back-btn">← Voltar</a>
    <span class="page-label" id="editorLabel">Novo Post</span>
  </div>
  <div class="topbar-right">
    <button class="btn btn-danger" id="btnDelete" onclick="deletePost()" style="display:none">Excluir post</button>
    <button class="btn btn-gold" id="btnDraft" onclick="save('draft')">Salvar rascunho</button>
    <button class="btn btn-primary" id="btnPublish" onclick="save('published')">Publicar</button>
  </div>
</div>

<div class="layout">
  <!-- EDITOR -->
  <div class="editor-col">
    <div class="field">
      <label>Título do Post</label>
      <input type="text" id="titleInput" placeholder="Digite o título do post..."/>
    </div>
    <div class="field">
      <label>Resumo (excerpt)</label>
      <textarea id="excerptInput" rows="2" placeholder="Breve descrição do post para listagens e SEO..."></textarea>
      <div class="char-count" id="excerptCount">0 / 200</div>
    </div>
    <div class="field">
      <label>Conteúdo</label>
      <div class="content-actions">
        <button type="button" class="btn btn-ghost" onclick="openEmbedModal()">Incorporar / Embed</button>
        <button type="button" class="btn btn-ghost" onclick="openHtmlModal()">Editar HTML</button>
      </div>
      <div id="editorContainer">
        <div id="quill"></div>
      </div>
      <div class="help-text">Para inserir ou editar imagem no texto: clique no ícone de imagem ou clique duas vezes em uma imagem já inserida. Use "Incorporar / Embed" para YouTube, Vimeo, Typeform, Google Forms e outros iframes.</div>
    </div>
  </div>

  <!-- SIDEBAR -->
  <div class="sidebar-col">
    <!-- Status -->
    <div class="panel">
      <div class="panel-title">Status</div>
      <div class="status-toggle">
        <button class="status-opt draft active" id="optDraft" onclick="setStatus('draft')">Rascunho</button>
        <button class="status-opt published" id="optPublished" onclick="setStatus('published')">Publicado</button>
      </div>
    </div>

    <!-- Capa -->
    <div class="panel">
      <div class="panel-title">Imagem de Capa</div>
      <div class="cover-preview" id="coverPreview">
        <img id="coverImg" src="" style="display:none"/>
        <div class="cover-placeholder" id="coverPlaceholder">
          <div class="icon">🖼️</div>
          <div>Capa por URL externa</div>
          <div style="font-size:11px;margin-top:4px">Cole o link da imagem abaixo</div>
        </div>
      </div>
      <input type="url" id="coverUrl" placeholder="https://exemplo.com/imagem.jpg" style="font-size:12px;padding:8px 10px;"/>
      <div class="cover-actions">
        <button class="btn btn-ghost" type="button" onclick="previewCoverFromUrl()">Visualizar</button>
        <button class="btn btn-ghost" type="button" onclick="clearCover()">Remover</button>
      </div>
      <div class="help-text">Use imagem já hospedada. Este fluxo evita upload de arquivo e reduz risco de erro no deploy.</div>
    </div>

    <!-- Categoria -->
    <div class="panel">
      <div class="panel-title">Categoria</div>
      <select id="categorySelect">
        <option value="">Sem categoria</option>
      </select>
    </div>

    <!-- SEO -->
    <div class="panel">
      <div class="panel-title">SEO</div>
      <div class="field">
        <label>Título SEO</label>
        <input type="text" id="seoTitle" placeholder="Título para Google (≤ 60 chars)"/>
        <div class="char-count" id="seoTitleCount">0 / 60</div>
      </div>
      <div class="field" style="margin-bottom:0">
        <label>Descrição SEO</label>
        <textarea id="seoDesc" rows="3" placeholder="Descrição para Google (≤ 160 chars)"></textarea>
        <div class="char-count" id="seoDescCount">0 / 160</div>
      </div>
    </div>
  </div>
</div>

<div id="imageModal" class="modal-overlay">
  <div class="modal-card">
    <h3 id="imageModalTitle">Inserir imagem no post</h3>

    <div class="field">
      <label>URL da imagem</label>
      <input type="url" id="modalImageUrl" placeholder="https://exemplo.com/imagem.jpg">
    </div>

    <div class="modal-grid">
      <div class="field">
        <label>Largura em px</label>
        <input type="text" id="modalImageWidth" placeholder="Ex: 600">
      </div>

      <div class="field">
        <label>Altura em px</label>
        <input type="text" id="modalImageHeight" placeholder="Opcional">
      </div>
    </div>

    <label class="modal-check">
      <input type="checkbox" id="modalImageKeepRatio" checked onchange="toggleImageHeightField()">
      Manter proporção da imagem
    </label>

    <div class="modal-actions">
      <button type="button" class="btn btn-danger" id="btnRemoveImage" onclick="removeSelectedImage()" style="display:none;">Remover imagem</button>
      <div class="modal-actions-right">
        <button type="button" class="btn btn-ghost" onclick="closeImageModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="insertImageFromModal()">Salvar imagem</button>
      </div>
    </div>
  </div>
</div>

<div id="embedModal" class="modal-overlay">
  <div class="modal-card">
    <h3>Incorporar conteúdo externo</h3>

    <div class="field">
      <label>Código embed / iframe</label>
      <textarea id="embedCodeInput" rows="8" placeholder='<iframe src="https://..."></iframe>'></textarea>
      <div class="embed-preview-note">Cole aqui o código de incorporação. O editor aceitará iframe com URL iniciada por http ou https.</div>
    </div>

    <div class="field">
      <label>Tamanho do embed</label>
      <select id="embedSizeSelect">
        <option value="760">Recomendado / Grande — 760px</option>
        <option value="640">Médio — 640px</option>
        <option value="480">Pequeno — 480px</option>
        <option value="100%">Largura total disponível</option>
      </select>
    </div>

    <div class="modal-actions">
      <span></span>
      <div class="modal-actions-right">
        <button type="button" class="btn btn-ghost" onclick="closeEmbedModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="insertEmbedFromModal()">Inserir embed</button>
      </div>
    </div>
  </div>
</div>

<div id="htmlModal" class="modal-overlay">
  <div class="modal-card" style="width:min(900px,94vw);">
    <h3>Editar HTML do post</h3>

    <div class="field">
      <label>HTML do conteúdo</label>
      <textarea id="htmlEditorTextarea" class="html-textarea" spellcheck="false"></textarea>
      <div class="embed-preview-note">Use com cuidado. Clique em "Aplicar HTML" para refletir no editor. Ao salvar o post, o servidor ainda fará uma limpeza de segurança no HTML.</div>
    </div>

    <div class="modal-actions">
      <span></span>
      <div class="modal-actions-right">
        <button type="button" class="btn btn-ghost" onclick="closeHtmlModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="applyHtmlFromModal()">Aplicar HTML</button>
      </div>
    </div>
  </div>
</div>

<div id="toast"></div>

<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
<script>
// ── Estado ──────────────────────────────────────────────────────────────────
const postId = (() => {
  const m = location.pathname.match(/\/admin\/posts\/(\d+)\/editar/);
  return m ? parseInt(m[1]) : null;
})();

let currentStatus = 'draft';
let saving = false;
let selectedImageNode = null;
let rawHtmlMode = false;

// ── Quill image format com largura/altura persistentes ──────────────────────
const BaseImage = Quill.import('formats/image');

class EcoImage extends BaseImage {
  static create(value) {
    const imageValue = typeof value === 'string' ? { url: value } : value;
    const node = super.create(imageValue.url);

    node.setAttribute('src', imageValue.url);
    node.classList.add('eco-image');

    if (imageValue.width) {
      node.setAttribute('width', imageValue.width);
      node.style.width = imageValue.width + 'px';
    }

    if (imageValue.height && !imageValue.keepRatio) {
      node.setAttribute('height', imageValue.height);
      node.style.height = imageValue.height + 'px';
      node.style.objectFit = 'cover';
    } else {
      node.removeAttribute('height');
      node.style.height = 'auto';
      node.style.objectFit = '';
    }

    node.style.maxWidth = '100%';
    node.style.borderRadius = '14px';
    node.style.margin = '24px auto';
    node.style.display = 'block';

    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      width: node.getAttribute('width') || parseInt(node.style.width, 10) || '',
      height: node.getAttribute('height') || parseInt(node.style.height, 10) || '',
      keepRatio: !node.getAttribute('height')
    };
  }

  static formats(node) {
    return {
      width: node.getAttribute('width') || parseInt(node.style.width, 10) || '',
      height: node.getAttribute('height') || parseInt(node.style.height, 10) || '',
      class: node.getAttribute('class') || ''
    };
  }

  format(name, value) {
    if (name === 'width') {
      if (value) {
        this.domNode.setAttribute('width', value);
        this.domNode.style.width = value + 'px';
      } else {
        this.domNode.removeAttribute('width');
        this.domNode.style.width = '';
      }
      return;
    }

    if (name === 'height') {
      if (value) {
        this.domNode.setAttribute('height', value);
        this.domNode.style.height = value + 'px';
        this.domNode.style.objectFit = 'cover';
      } else {
        this.domNode.removeAttribute('height');
        this.domNode.style.height = 'auto';
        this.domNode.style.objectFit = '';
      }
      return;
    }

    super.format(name, value);
  }
}

Quill.register(EcoImage, true);

// ── Quill ────────────────────────────────────────────────────────────────────
const quill = new Quill('#quill', {
  theme: 'snow',
  placeholder: 'Escreva o conteúdo do post aqui...',
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ color: [] }, { background: [] }],
        ['clean']
      ],
      handlers: {
        image: function () {
          openImageModal();
        }
      }
    }
  }
});

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();

  if (postId) {
    document.getElementById('editorLabel').textContent = 'Editando Post';
    document.getElementById('btnDelete').style.display = 'inline-flex';
    await loadPost();
  }

  bindCounters();
  bindImageEditing();

  quill.on('text-change', () => {
    if (rawHtmlMode) {
      // Mantém o modo HTML ativo após aplicar HTML manual.
      quill.root.setAttribute('data-raw-html', 'true');
    }
  });

  document.getElementById('coverUrl').addEventListener('change', e => {
    if (e.target.value) showCoverPreview(e.target.value);
  });
});

async function loadCategories() {
  const cats = await api('/api/admin/categorias');
  if (!cats) return;

  const sel = document.getElementById('categorySelect');
  sel.innerHTML = '<option value="">Sem categoria</option>';

  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

async function loadPost() {
  const post = await api(`/api/admin/posts/${postId}`);
  if (!post) return;

  document.getElementById('titleInput').value = post.title;
  document.getElementById('excerptInput').value = post.excerpt || '';
  document.getElementById('coverUrl').value = post.cover_url || '';
  document.getElementById('seoTitle').value = post.seo_title || '';
  document.getElementById('seoDesc').value = post.seo_description || '';
  document.getElementById('categorySelect').value = post.category_id || '';

  if (post.cover_url) showCoverPreview(post.cover_url);

  quill.root.innerHTML = removeBase64Images(post.content || '');
  normalizeExistingImages();

  setStatus(post.status);
  updateCounters();
}

// ── Status ────────────────────────────────────────────────────────────────────
function setStatus(s) {
  currentStatus = s;
  document.getElementById('optDraft').classList.toggle('active', s === 'draft');
  document.getElementById('optPublished').classList.toggle('active', s === 'published');
}

// ── Salvar ────────────────────────────────────────────────────────────────────
async function save(forceStatus) {
  if (saving) return;

  const title = document.getElementById('titleInput').value.trim();
  if (!title) {
    toast('Digite um título', 'error');
    return;
  }

  normalizeExistingImages();

  let content = removeBase64Images(quill.root.innerHTML);

  if (content === '<p><br></p>' || !content.trim()) {
    toast('O conteúdo está vazio', 'error');
    return;
  }

  if (content.length > 180000) {
    toast('Conteúdo muito grande. Use imagens por URL, não imagem colada.', 'error');
    return;
  }

  const coverUrl = document.getElementById('coverUrl').value.trim();
  if (coverUrl && !isValidUrl(coverUrl)) {
    toast('URL da capa inválida.', 'error');
    return;
  }

  const status = forceStatus || currentStatus;
  saving = true;

  const btns = document.querySelectorAll('.topbar-right .btn');
  btns.forEach(b => {
    b.disabled = true;
    b.textContent = 'Salvando...';
  });

  const body = {
    title,
    content,
    excerpt: document.getElementById('excerptInput').value.trim(),
    cover_url: coverUrl || null,
    status,
    category_id: document.getElementById('categorySelect').value || null,
    seo_title: document.getElementById('seoTitle').value.trim() || null,
    seo_description: document.getElementById('seoDesc').value.trim() || null
  };

  const url = postId ? `/api/admin/posts/${postId}` : '/api/admin/posts';
  const method = postId ? 'PUT' : 'POST';
  const result = await api(url, method, body);

  saving = false;

  btns.forEach(b => b.disabled = false);
  document.getElementById('btnDraft').textContent = 'Salvar rascunho';
  document.getElementById('btnPublish').textContent = 'Publicar';
  document.getElementById('btnDelete').textContent = 'Excluir post';

  if (result) {
    toast(status === 'published' ? 'Post publicado!' : 'Rascunho salvo!');
    setStatus(status);

    if (!postId) {
      setTimeout(() => {
        location.href = `/admin/posts/${result.id}/editar`;
      }, 900);
    }
  }
}

// ── Imagem de capa por URL ───────────────────────────────────────────────────
function previewCoverFromUrl() {
  const url = document.getElementById('coverUrl').value.trim();

  if (!url) {
    toast('Cole uma URL de imagem.', 'error');
    return;
  }

  if (!isValidUrl(url)) {
    toast('URL de capa inválida.', 'error');
    return;
  }

  showCoverPreview(url);
}

function clearCover() {
  document.getElementById('coverUrl').value = '';
  document.getElementById('coverImg').src = '';
  document.getElementById('coverImg').style.display = 'none';
  document.getElementById('coverPlaceholder').style.display = 'block';
}

function showCoverPreview(url) {
  const img = document.getElementById('coverImg');
  const ph = document.getElementById('coverPlaceholder');

  img.src = url;
  img.style.display = 'block';
  ph.style.display = 'none';
}

// ── Modal de imagem do conteúdo ──────────────────────────────────────────────
function openImageModal(imageNode = null) {
  selectedImageNode = imageNode;

  document.querySelectorAll('.ql-editor img').forEach(img => img.classList.remove('is-selected'));

  const modal = document.getElementById('imageModal');
  const removeBtn = document.getElementById('btnRemoveImage');
  const title = document.getElementById('imageModalTitle');

  if (imageNode) {
    imageNode.classList.add('is-selected');
    title.textContent = 'Editar imagem do post';
    removeBtn.style.display = 'inline-flex';

    document.getElementById('modalImageUrl').value = imageNode.getAttribute('src') || '';
    document.getElementById('modalImageWidth').value = imageNode.getAttribute('width') || parseInt(imageNode.style.width, 10) || '600';

    const existingHeight = imageNode.getAttribute('height') || parseInt(imageNode.style.height, 10) || '';
    document.getElementById('modalImageHeight').value = existingHeight;

    document.getElementById('modalImageKeepRatio').checked = !existingHeight;
  } else {
    title.textContent = 'Inserir imagem no post';
    removeBtn.style.display = 'none';

    document.getElementById('modalImageUrl').value = '';
    document.getElementById('modalImageWidth').value = '600';
    document.getElementById('modalImageHeight').value = '';
    document.getElementById('modalImageKeepRatio').checked = true;
  }

  toggleImageHeightField();

  modal.style.display = 'flex';

  setTimeout(() => {
    document.getElementById('modalImageUrl').focus();
  }, 50);
}

function closeImageModal() {
  document.getElementById('imageModal').style.display = 'none';
  document.querySelectorAll('.ql-editor img').forEach(img => img.classList.remove('is-selected'));
  selectedImageNode = null;
}

function toggleImageHeightField() {
  const keepRatio = document.getElementById('modalImageKeepRatio').checked;
  const heightInput = document.getElementById('modalImageHeight');

  heightInput.disabled = keepRatio;
  heightInput.style.opacity = keepRatio ? '.45' : '1';

  if (keepRatio) heightInput.value = '';
}

function insertImageFromModal() {
  const url = document.getElementById('modalImageUrl').value.trim();
  let width = parseInt(document.getElementById('modalImageWidth').value || '600', 10);
  let height = parseInt(document.getElementById('modalImageHeight').value || '', 10);
  const keepRatio = document.getElementById('modalImageKeepRatio').checked;

  if (!url) {
    toast('Informe a URL da imagem.', 'error');
    return;
  }

  if (!isValidUrl(url)) {
    toast('URL de imagem inválida.', 'error');
    return;
  }

  if (isNaN(width)) width = 600;
  if (width < 80) width = 80;
  if (width > 1200) width = 1200;

  if (!keepRatio) {
    if (isNaN(height)) height = 350;
    if (height < 80) height = 80;
    if (height > 900) height = 900;
  } else {
    height = '';
  }

  if (selectedImageNode) {
    updateImageNode(selectedImageNode, { url, width, height, keepRatio });
    closeImageModal();
    return;
  }

  const range = quill.getSelection(true);

  quill.insertEmbed(range.index, 'image', {
    url,
    width,
    height,
    keepRatio
  }, 'user');

  quill.insertText(range.index + 1, '\n', 'user');
  quill.setSelection(range.index + 2);
  closeImageModal();
}

function updateImageNode(img, { url, width, height, keepRatio }) {
  img.setAttribute('src', url);
  img.setAttribute('width', width);
  img.classList.add('eco-image');
  img.style.width = width + 'px';
  img.style.maxWidth = '100%';
  img.style.borderRadius = '14px';
  img.style.margin = '24px auto';
  img.style.display = 'block';

  if (!keepRatio && height) {
    img.setAttribute('height', height);
    img.style.height = height + 'px';
    img.style.objectFit = 'cover';
  } else {
    img.removeAttribute('height');
    img.style.height = 'auto';
    img.style.objectFit = '';
  }
}

function removeSelectedImage() {
  if (!selectedImageNode) return;

  selectedImageNode.remove();
  closeImageModal();
  toast('Imagem removida.');
}

function bindImageEditing() {
  quill.root.addEventListener('dblclick', e => {
    const img = e.target.closest('img');
    if (!img) return;

    e.preventDefault();
    openImageModal(img);
  });

  quill.root.addEventListener('click', e => {
    const img = e.target.closest('img');

    document.querySelectorAll('.ql-editor img').forEach(i => i.classList.remove('is-selected'));

    if (img) {
      img.classList.add('is-selected');
    }
  });

  quill.root.addEventListener('paste', e => {
    const items = e.clipboardData && e.clipboardData.items ? Array.from(e.clipboardData.items) : [];

    if (items.some(item => item.type && item.type.startsWith('image/'))) {
      e.preventDefault();
      toast('Imagem colada bloqueada. Use URL da imagem pelo botão de imagem.', 'error');
    }
  });

  quill.root.addEventListener('drop', e => {
    const files = e.dataTransfer && e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];

    if (files.some(file => file.type && file.type.startsWith('image/'))) {
      e.preventDefault();
      toast('Arrastar imagem do computador foi bloqueado. Use URL da imagem.', 'error');
    }
  });
}

function normalizeExistingImages() {
  quill.root.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';

    if (src.startsWith('data:')) {
      img.remove();
      return;
    }

    img.classList.add('eco-image');

    const width = img.getAttribute('width') || parseInt(img.style.width, 10) || '';

    if (width) {
      img.setAttribute('width', width);
      img.style.width = width + 'px';
    }

    img.style.maxWidth = '100%';
    img.style.borderRadius = '14px';
    img.style.margin = '24px auto';
    img.style.display = 'block';

    const height = img.getAttribute('height') || parseInt(img.style.height, 10) || '';

    if (height) {
      img.setAttribute('height', height);
      img.style.height = height + 'px';
      img.style.objectFit = 'cover';
    } else {
      img.removeAttribute('height');
      img.style.height = 'auto';
      img.style.objectFit = '';
    }
  });
}

function removeBase64Images(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  wrapper.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';

    if (src.startsWith('data:')) {
      img.remove();
    }
  });

  return wrapper.innerHTML;
}


// ── Embed e HTML manual ──────────────────────────────────────────────────────
function openEmbedModal() {
  document.getElementById('embedCodeInput').value = '';
  document.getElementById('embedSizeSelect').value = '760';
  document.getElementById('embedModal').style.display = 'flex';

  setTimeout(() => {
    document.getElementById('embedCodeInput').focus();
  }, 50);
}

function closeEmbedModal() {
  document.getElementById('embedModal').style.display = 'none';
}

function insertEmbedFromModal() {
  const raw = document.getElementById('embedCodeInput').value.trim();

  if (!raw) {
    toast('Cole um código embed ou iframe.', 'error');
    return;
  }

  const embedSize = document.getElementById('embedSizeSelect').value || '760';
  const iframeHtml = buildSafeIframeEmbed(raw, embedSize);

  if (!iframeHtml) {
    toast('Não encontrei um iframe válido com URL http/https.', 'error');
    return;
  }

  const range = quill.getSelection(true);

  quill.clipboard.dangerouslyPasteHTML(
    range.index,
    iframeHtml + '<p><br></p>'
  );

  quill.setSelection(range.index + 1);
  closeEmbedModal();
}

function buildSafeIframeEmbed(raw, embedSize = '760') {
  const doc = new DOMParser().parseFromString(raw, 'text/html');
  const iframe = doc.querySelector('iframe');

  if (!iframe) return null;

  const src = iframe.getAttribute('src') || '';

  if (!isValidUrl(src)) return null;

  const title = escapeAttr(iframe.getAttribute('title') || 'Conteúdo incorporado');
  const allow = escapeAttr(iframe.getAttribute('allow') || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  const srcSafe = escapeAttr(src);

  let maxWidthStyle = 'max-width:760px;';
  if (embedSize === '100%') {
    maxWidthStyle = 'max-width:100%;';
  } else {
    const parsedSize = parseInt(embedSize, 10);
    const safeSize = isNaN(parsedSize) ? 760 : Math.max(320, Math.min(parsedSize, 960));
    maxWidthStyle = `max-width:${safeSize}px;`;
  }

  return `<div class="eco-embed-wrapper" style="position:relative;width:100%;${maxWidthStyle}margin:32px auto;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#111827;box-shadow:0 8px 32px rgba(26,10,94,.12);">
    <iframe src="${srcSafe}" title="${title}" allow="${allow}" allowfullscreen frameborder="0" style="position:absolute;inset:0;width:100%;height:100%;border:0;display:block;"></iframe>
  </div>`;
}

function openHtmlModal() {
  normalizeExistingImages();
  document.getElementById('htmlEditorTextarea').value = quill.root.innerHTML;
  document.getElementById('htmlModal').style.display = 'flex';

  setTimeout(() => {
    document.getElementById('htmlEditorTextarea').focus();
  }, 50);
}

function closeHtmlModal() {
  document.getElementById('htmlModal').style.display = 'none';
}

function applyHtmlFromModal() {
  const html = document.getElementById('htmlEditorTextarea').value.trim();

  if (!html) {
    toast('O HTML está vazio.', 'error');
    return;
  }

  const cleanHtml = removeBase64Images(html);

  // Modo HTML manual: aplica diretamente no editor visual,
  // sem depender da conversão do Quill, que pode descartar divs/iframes.
  rawHtmlMode = true;
  quill.root.setAttribute('data-raw-html', 'true');
  quill.root.innerHTML = cleanHtml;

  normalizeExistingImages();

  // Garante que o conteúdo aplicado seja reconhecido para salvamento.
  quill.update('user');

  closeHtmlModal();
  toast('HTML aplicado ao editor.');
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Excluir post ─────────────────────────────────────────────────────────────
async function deletePost() {
  if (!postId) return;

  const ok = confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.');
  if (!ok) return;

  const result = await api(`/api/admin/posts/${postId}`, 'DELETE');

  if (result) {
    toast('Post excluído com sucesso!');
    setTimeout(() => {
      location.href = '/admin';
    }, 800);
  }
}

// ── Contadores de caracteres ─────────────────────────────────────────────────
function bindCounters() {
  const fields = [
    { input: 'excerptInput', count: 'excerptCount', max: 200 },
    { input: 'seoTitle', count: 'seoTitleCount', max: 60 },
    { input: 'seoDesc', count: 'seoDescCount', max: 160 }
  ];

  fields.forEach(({ input, count, max }) => {
    const el = document.getElementById(input);
    el.addEventListener('input', () => updateCount(input, count, max));
  });

  updateCounters();
}

function updateCount(inputId, countId, max) {
  const val = document.getElementById(inputId).value.length;
  const el = document.getElementById(countId);

  el.textContent = `${val} / ${max}`;
  el.className = `char-count ${val > max ? 'over' : val > max * 0.85 ? 'warn' : ''}`;
}

function updateCounters() {
  updateCount('excerptInput', 'excerptCount', 200);
  updateCount('seoTitle', 'seoTitleCount', 60);
  updateCount('seoDesc', 'seoDescCount', 160);
}

// ── Utils ────────────────────────────────────────────────────────────────────
async function api(url, method = 'GET', body = null) {
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);

    const r = await fetch(url, opts);

    if (r.status === 401) {
      location.href = '/admin/login';
      return null;
    }

    if (!r.ok) {
      if (r.status === 413) {
        toast('Conteúdo grande demais. Use imagem por URL, não imagem colada.', 'error');
        return null;
      }

      const e = await r.json().catch(() => ({}));
      toast(e.error || 'Erro', 'error');
      return null;
    }

    return r.json();
  } catch {
    toast('Erro de conexão', 'error');
    return null;
  }
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

function toast(msg, type = 'success') {
  const t = document.getElementById('toast');

  t.textContent = msg;
  t.className = `show ${type}`;

  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3500);
}

// Ctrl+S para salvar
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    save(currentStatus);
  }

  if (e.key === 'Escape') {
    closeImageModal();
    closeEmbedModal();
    closeHtmlModal();
  }
});
</script>
</body>
</html>
