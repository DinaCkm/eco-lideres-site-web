const DIFFERENTIALS_SECTION = `    <!-- DIFERENCIAIS -->
    <section class="section section-diff" id="sobre-nos">
      <div class="container">
        <div class="section-header">
          <div class="eyebrow light">Nossa essência</div>
          <h2 class="title on-dark">O que nos torna únicos</h2>
          <p class="subtitle on-dark" style="max-width:920px;">
            O ECO do B.E.M. nasceu da experiência prática de mais de 30 anos em Psicologia Organizacional, Desenvolvimento Humano, Gestão de Pessoas e formação de lideranças.
          </p>
        </div>

        <article class="diff-card" style="margin-bottom:22px;">
          <h3>Experiência que deu origem a uma metodologia</h3>
          <p>
            Idealizado por Dina Makiyama, psicóloga organizacional, empresária e especialista em desenvolvimento humano e de carreira, o ecossistema foi criado para responder a um desafio recorrente nas organizações: transformar avaliações, treinamentos e planos de desenvolvimento em mudanças efetivamente aplicadas ao trabalho.
          </p>
          <p style="margin-top:14px;">
            A origem do ECO do B.E.M. está na prática de acompanhar pessoas, líderes e organizações ao longo do tempo, reconhecendo que o desenvolvimento não se consolida em uma ação isolada. Ele exige direção, continuidade, apoio humano e espaço para aplicar o aprendizado à realidade profissional.
          </p>
        </article>

        <article class="diff-card" style="margin-bottom:22px;">
          <h3>A Metodologia do B.E.M.</h3>
          <p style="margin-bottom:22px;">
            A Metodologia do B.E.M. organiza o desenvolvimento em uma jornada estruturada, que pode integrar:
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Diagnóstico de perfil, competências e necessidades</div>
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Definição de prioridades de desenvolvimento</div>
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Conteúdos e experiências de aprendizagem</div>
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Mentorias e acompanhamento humano</div>
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Ações práticas relacionadas ao trabalho</div>
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Registro de evidências</div>
            <div style="padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.07);">Indicadores de participação, aplicação e evolução</div>
          </div>
        </article>

        <div class="diff-grid">
          <article class="diff-card">
            <div class="diff-icon purple">01</div>
            <h3>Diagnóstico e direção</h3>
            <p>O ponto de partida é compreender o perfil, as competências, o contexto e as necessidades reais. A partir dessa leitura, são definidas prioridades coerentes com os desafios da pessoa e da organização.</p>
          </article>
          <article class="diff-card">
            <div class="diff-icon teal">02</div>
            <h3>Desenvolvimento e acompanhamento</h3>
            <p>Conteúdos, experiências de aprendizagem e mentorias são articulados em uma jornada contínua. O acompanhamento humano ajuda a interpretar resultados, ajustar rotas e sustentar o processo.</p>
          </article>
          <article class="diff-card">
            <div class="diff-icon green">03</div>
            <h3>Aplicação e evolução</h3>
            <p>O aprendizado é levado para situações concretas do trabalho, com ações práticas, registro de evidências e indicadores que tornam a participação, a aplicação e a evolução observáveis.</p>
          </article>
        </div>

        <div style="margin-top:28px;padding:26px 28px;border-radius:20px;background:rgba(255,255,255,.13);border-left:5px solid var(--teal);font-family:'Poppins',sans-serif;font-size:clamp(1.05rem,2vw,1.3rem);font-weight:700;line-height:1.55;color:#fff;">
          Não entregamos apenas treinamentos. Estruturamos jornadas de desenvolvimento acompanhadas, aplicadas e conectadas à realidade das pessoas e das organizações.
        </div>
      </div>
    </section>`;

const CORPORATE_SOLUTIONS = [
  {
    href: 'solucoes-empresas.html',
    title: 'Visão geral das soluções',
    description: 'Compare e escolha a solução mais adequada',
    icon: '🧭',
    color: 'teal'
  },
  {
    href: 'eco-lideres.html',
    title: 'ECO Líderes',
    description: 'Certificação de liderança em 6 meses',
    icon: '🎯',
    color: 'purple'
  },
  {
    href: 'eco-disc-360.html',
    title: 'ECO DISC 360',
    description: 'Diagnóstico comportamental com múltiplas percepções',
    icon: '🧠',
    color: 'purple'
  },
  {
    href: 'eco-times.html',
    title: 'ECO Times',
    description: 'Desenvolvimento coletivo de equipes',
    icon: '👥',
    color: 'teal'
  },
  {
    href: 'plataforma-pdi.html',
    title: 'Plataforma de PDI',
    description: 'Gestão de PDI corporativo com dado real',
    icon: '📊',
    color: 'green'
  },
  {
    href: 'bem-nr1.html',
    title: 'BEM NR-1',
    description: 'Gestão de riscos psicossociais',
    icon: '⚖️',
    color: 'pink'
  },
  {
    href: 'convenio-corporativo.html',
    title: 'Convênio Corporativo',
    description: 'Sua empresa como conveniada ECO',
    icon: '🤝',
    color: 'gold'
  },
  {
    href: 'projetos-personalizados.html',
    title: 'Projetos Personalizados',
    description: 'Soluções desenhadas para desafios específicos',
    icon: '🛠️',
    color: 'teal'
  }
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function corporateDropdownLink(solution) {
  return `<a href="${solution.href}" class="eco-dd-link" data-color="${solution.color}">
            <div class="eco-dd-icon">${solution.icon}</div>
            <div class="eco-dd-body"><div class="eco-dd-title">${solution.title}</div><div class="eco-dd-desc">${solution.description}</div></div>
          </a>`;
}

function normalizeCorporateSolutionMenus(html) {
  let transformed = html;
  const overview = CORPORATE_SOLUTIONS[0];
  const overviewDropdownPattern = /<a\b(?=[^>]*\bhref=["']solucoes-empresas\.html["'])(?=[^>]*\bclass=["'][^"']*eco-dd-link[^"']*["'])[^>]*>/i;

  if (!overviewDropdownPattern.test(transformed)) {
    transformed = transformed.replace(
      /(<div\b[^>]*class=["'][^"']*eco-dd-section[^"']*["'][^>]*>[^<]*(?:Produtos B2B|Atalhos para as soluções)[^<]*<\/div>)/i,
      `$1\n          ${corporateDropdownLink(overview)}`
    );
  }

  CORPORATE_SOLUTIONS.forEach((solution) => {
    const escapedHref = escapeRegExp(solution.href);
    const dropdownPattern = new RegExp(
      `<a\\b(?=[^>]*\\bhref=["']${escapedHref}["'])(?=[^>]*\\bclass=["'][^"']*eco-dd-link[^"']*["'])[^>]*>[\\s\\S]*?<\\/a>`,
      'g'
    );
    transformed = transformed.replace(dropdownPattern, corporateDropdownLink(solution));

    const mobilePattern = new RegExp(
      `(<a\\b(?=[^>]*\\bhref=["']${escapedHref}["'])(?=[^>]*\\bclass=["'][^"']*eco-mobile-link[^"']*["'])[^>]*>)[\\s\\S]*?(<\\/a>)`,
      'g'
    );
    transformed = transformed.replace(
      mobilePattern,
      `$1${solution.icon} ${solution.title}$2`
    );
  });

  return transformed;
}

function updateMenuLabels(html) {
  let transformed = html.replace(
    /(<a\b[^>]*class=["'][^"']*(?:eco-nav-link|eco-mobile-link|nav-link)[^"']*["'][^>]*>\s*)Início(\s*<\/a>)/g,
    '$1Sobre Nós$2'
  );

  transformed = transformed.replace(
    /<button\b([^>]*class=["'][^"']*eco-nav-link[^"']*["'][^>]*)>\s*(?:Para Empresas|Soluções para Empresas)\s*(<svg\b[\s\S]*?<\/svg>)\s*<\/button>/g,
    '<a href="solucoes-empresas.html" class="eco-nav-link">Soluções para Empresas $2</a>'
  );

  transformed = transformed.replace(
    /<div\b[^>]*class=["'][^"']*eco-mobile-section-title[^"']*["'][^>]*>\s*(?:Para Empresas|Soluções para Empresas)\s*<\/div>/g,
    '<a href="solucoes-empresas.html" class="eco-mobile-section-title">Soluções para Empresas</a>'
  );

  if (!transformed.includes('href="eco-disc-360.html"')) {
    transformed = transformed.replace(
      /(<div class="eco-dd-section">Produtos B2B<\/div>)/,
      `$1\n          ${corporateDropdownLink(CORPORATE_SOLUTIONS[0])}\n          ${corporateDropdownLink(CORPORATE_SOLUTIONS[2])}`
    );
  }

  if (!transformed.includes('href="projetos-personalizados.html"')) {
    transformed = transformed.replace(
      /(<a href="convenio-corporativo\.html" class="eco-dd-link"[\s\S]*?<\/a>)/,
      `$1\n          ${corporateDropdownLink(CORPORATE_SOLUTIONS[7])}`
    );
  }

  if (!transformed.includes('class="eco-mobile-link">🧠 ECO DISC 360</a>')) {
    transformed = transformed.replace(
      /(<a href="solucoes-empresas\.html" class="eco-mobile-section-title">Soluções para Empresas<\/a>)/,
      '$1\n    <a href="eco-disc-360.html" class="eco-mobile-link">🧠 ECO DISC 360</a>'
    );
  }

  if (!transformed.includes('class="eco-mobile-link">🛠️ Projetos Personalizados</a>')) {
    transformed = transformed.replace(
      /(<a href="convenio-corporativo\.html" class="eco-mobile-link">[^<]*Convênio Corporativo<\/a>)/,
      '$1\n    <a href="projetos-personalizados.html" class="eco-mobile-link">🛠️ Projetos Personalizados</a>'
    );
  }

  return normalizeCorporateSolutionMenus(transformed);
}

function withClientAreaMenu(html) {
  if (html.includes('href="clientes.html"')) return html;

  const desktopLink = '      <a href="clientes.html" class="eco-nav-link">Área de Clientes</a>\n';
  const mobileLink = '    <a href="clientes.html" class="eco-mobile-link">🔐 Área de Clientes</a>\n';

  return html
    .replace('      <a href="/blog" class="eco-nav-link">Blog</a>\n', '      <a href="/blog" class="eco-nav-link">Blog</a>\n' + desktopLink)
    .replace('    <a href="/blog" class="eco-mobile-link">Blog</a>\n', '    <a href="/blog" class="eco-mobile-link">Blog</a>\n' + mobileLink);
}

function replaceDifferentialsSection(html) {
  if (!html.includes('<!-- DIFERENCIAIS -->') || !html.includes('<!-- CONFIANÇA -->')) {
    return html;
  }

  return html.replace(
    /\s*<!-- DIFERENCIAIS -->[\s\S]*?<\/section>\s*(?=<!-- CONFIANÇA -->)/,
    `\n${DIFFERENTIALS_SECTION}\n\n    `
  );
}

function applyLegacyMenuFix(html) {
  if (!html.includes('Convênio Corporativo ECO Líderes')) return html;

  let transformed = html;

  if (!transformed.includes('css/menu-unificado.css')) {
    transformed = transformed.replace(
      '</head>',
      '  <link rel="stylesheet" href="css/menu-unificado.css">\n</head>'
    );
  }

  if (!transformed.includes('/* MENU UNIFICADO MOBILE */')) {
    const mobileScript = `
<script>
/* MENU UNIFICADO MOBILE */
(function () {
  const hamburger = document.getElementById('ecoHamburger');
  const mobileMenu = document.getElementById('ecoMobileMenu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();
</script>`;

    transformed = transformed.replace('</body>', `${mobileScript}\n</body>`);
  }

  return transformed;
}

function transformSiteHtml(html, { isHome = false } = {}) {
  let transformed = updateMenuLabels(html);

  if (isHome) {
    transformed = withClientAreaMenu(transformed);
    transformed = replaceDifferentialsSection(transformed);
  }

  transformed = applyLegacyMenuFix(transformed);
  return transformed;
}

module.exports = { transformSiteHtml };
