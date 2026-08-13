const sharp = require('sharp');

const options = [
  {
    file: 'voreal-a-mercado-contemporaneo.png',
    code: 'A',
    name: 'Mercado contemporáneo',
    recommended: true,
    background: '#FFF9EF',
    hero: ['#FFF3D6', '#DFF7E4'],
    ink: '#10213F',
    primary: '#FF5C35',
    accent: '#39D353',
    eyebrowBg: '#FFE3D7',
    eyebrowInk: '#9B351E',
    chip: '#FFF0D2',
    chipInk: '#744D12',
    photo1: ['#EF6F3D', '#8C2D18'],
    photo2: ['#39A565', '#0E5632'],
    eyebrow: 'BALTIMORE HABLA ESPAÑOL',
    title: ['Lo mejor de nuestra', 'comunidad, cerca de ti.'],
    subtitle: ['Descubre restaurantes, profesionales y servicios latinos', 'recomendados por tu comunidad.'],
    categories: ['Cerca de mí', 'Restaurantes', 'Belleza', 'Servicios'],
    businesses: [['Sabor de Casa', 'Mexicano · Highlandtown'], ["Mingo's Barbershop", 'Barbería · Baltimore']],
    description: ['Cálido, humano y confiable. La identidad latina aparece', 'en el ritmo, el color y la comunidad, sin clichés.'],
    traits: ['ACOGEDOR', 'LOCAL', 'MEMORABLE']
  },
  {
    file: 'voreal-b-premium-urbano.png',
    code: 'B',
    name: 'Directorio premium urbano',
    background: '#F7F9FC',
    hero: ['#061A42', '#0B2C6B'],
    ink: '#071B46',
    heroInk: '#FFFFFF',
    primary: '#146CFF',
    accent: '#8AB7FF',
    eyebrowBg: '#173B75',
    eyebrowInk: '#A9C9FF',
    chip: '#E9EEF6',
    chipInk: '#40536F',
    photo1: ['#3C5576', '#172B49'],
    photo2: ['#146CFF', '#073181'],
    eyebrow: 'DIRECTORIO LATINO VERIFICADO',
    title: ['Negocios que sí entienden', 'lo que necesitas.'],
    subtitle: ['Servicios locales confiables, información clara', 'y contacto directo.'],
    categories: ['Todos', 'Legal', 'Hogar', 'Salud'],
    businesses: [['Martínez Tax Services', 'Impuestos · Dundalk'], ['Latino Auto Center', 'Mecánica · Baltimore']],
    description: ['Más institucional y tecnológico. Favorece credibilidad,', 'expansión nacional y servicios profesionales.'],
    traits: ['SERIO', 'ESCALABLE', 'PRECISO']
  },
  {
    file: 'voreal-c-comunidad-vibrante.png',
    code: 'C',
    name: 'Comunidad vibrante',
    background: '#FFFFFF',
    hero: ['#F3EAFF', '#FFF1E8'],
    ink: '#211248',
    primary: '#7B2CFF',
    accent: '#FF6A00',
    eyebrowBg: '#E9DBFF',
    eyebrowInk: '#6322CF',
    chip: '#F2EAFF',
    chipInk: '#6322CF',
    photo1: ['#FF6A00', '#FF2F6D'],
    photo2: ['#7B2CFF', '#146CFF'],
    eyebrow: 'HECHO POR Y PARA LATINOS',
    title: ['Tu ciudad tiene sabor.', 'Descúbrelo.'],
    subtitle: ['Conecta con negocios, experiencias y personas', 'que mueven nuestra comunidad.'],
    categories: ['Tendencias', 'Comida', 'Eventos', 'Compras'],
    businesses: [['La Esquina Latina', 'Restaurante · Canton'], ['Luna Beauty Studio', 'Belleza · Baltimore']],
    description: ['Enérgico, social y juvenil. Maximiza diferenciación,', 'aunque requiere disciplina para no saturar.'],
    traits: ['EXPRESIVO', 'SOCIAL', 'AUDAZ']
  }
];

const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function textLines(lines, x, y, className, lineHeight) {
  return `<text x="${x}" y="${y}" class="${className}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${esc(line)}</tspan>`).join('')}</text>`;
}

function pill(x, y, width, text, fill, color) {
  return `<rect x="${x}" y="${y}" width="${width}" height="42" rx="21" fill="${fill}"/><text x="${x + width / 2}" y="${y + 27}" class="pill" fill="${color}" text-anchor="middle">${esc(text)}</text>`;
}

function render(option, index) {
  const heroInk = option.heroInk || option.ink;
  const firstChipFill = option.code === 'A' ? '#071B46' : option.primary;
  const firstWidths = [122, 138, 100, 100];
  let chipX = 82;
  const chips = option.categories.map((category, i) => {
    const width = firstWidths[i];
    const result = pill(chipX, 710, width, category, i === 0 ? firstChipFill : option.chip, i === 0 ? '#FFFFFF' : option.chipInk);
    chipX += width + 12;
    return result;
  }).join('');

  let traitX = 60;
  const traits = option.traits.map((trait) => {
    const width = 40 + trait.length * 11;
    const result = pill(traitX, 1340, width, trait, '#EEF2F7', '#4C5A6A');
    traitX += width + 12;
    return result;
  }).join('');

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1440" viewBox="0 0 800 1440">
    <defs>
      <linearGradient id="hero${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${option.hero[0]}"/><stop offset="1" stop-color="${option.hero[1]}"/></linearGradient>
      <linearGradient id="photo1${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${option.photo1[0]}"/><stop offset="1" stop-color="${option.photo1[1]}"/></linearGradient>
      <linearGradient id="photo2${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${option.photo2[0]}"/><stop offset="1" stop-color="${option.photo2[1]}"/></linearGradient>
      <filter id="shadow${index}" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#071B46" flood-opacity=".14"/></filter>
      <style>
        text { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .logo { font-size: 20px; font-weight: 800; fill: ${option.ink}; }
        .nav { font-size: 14px; font-weight: 650; fill: ${option.ink}; opacity: .72; }
        .eyebrow { font-size: 13px; font-weight: 800; letter-spacing: 1.4px; fill: ${option.eyebrowInk}; }
        .hero-title { font-size: 44px; font-weight: 850; letter-spacing: -1.7px; fill: ${heroInk}; }
        .hero-copy { font-size: 17px; font-weight: 450; fill: ${heroInk}; opacity: .72; }
        .search-text { font-size: 15px; font-weight: 550; fill: ${option.ink}; opacity: .68; }
        .button { font-size: 15px; font-weight: 800; fill: #fff; }
        .section-title { font-size: 23px; font-weight: 800; fill: ${option.ink}; }
        .link { font-size: 14px; font-weight: 700; fill: ${option.primary}; }
        .pill { font-size: 13px; font-weight: 750; }
        .status { font-size: 12px; font-weight: 850; fill: #fff; letter-spacing: .5px; }
        .business { font-size: 17px; font-weight: 800; fill: ${option.ink}; }
        .meta { font-size: 13px; font-weight: 500; fill: ${option.ink}; opacity: .58; }
        .option-label { font-size: 14px; font-weight: 850; fill: ${option.primary}; letter-spacing: 1.5px; }
        .option-name { font-size: 29px; font-weight: 850; fill: ${option.ink}; }
        .description { font-size: 18px; font-weight: 450; fill: #5A6879; }
      </style>
    </defs>
    <rect width="800" height="1440" fill="#EEF2F6"/>
    ${option.recommended ? '<rect x="571" y="20" width="181" height="38" rx="19" fill="#071B46"/><text x="661" y="45" class="status" text-anchor="middle">RECOMENDADO</text>' : ''}
    <g filter="url(#shadow${index})">
      <rect x="40" y="62" width="720" height="1106" rx="28" fill="${option.background}"/>
    </g>
    <rect x="40" y="62" width="720" height="48" rx="28" fill="#FFFFFF" fill-opacity=".76"/>
    <rect x="40" y="87" width="720" height="23" fill="#FFFFFF" fill-opacity=".76"/>
    <circle cx="70" cy="86" r="5" fill="#9AA8BA"/><circle cx="88" cy="86" r="5" fill="#9AA8BA" opacity=".7"/><circle cx="106" cy="86" r="5" fill="#9AA8BA" opacity=".45"/>
    <g>
      <rect x="68" y="130" width="36" height="36" rx="10" fill="${option.primary}"/>
      <text x="86" y="154" font-size="18" font-weight="900" text-anchor="middle" fill="#fff">V</text>
      <text x="116" y="154" class="logo">Red Latina 360</text>
      <text x="470" y="153" class="nav">Explorar</text><text x="545" y="153" class="nav">Para negocios</text>
      <rect x="652" y="132" width="80" height="33" rx="10" fill="${option.primary}"/><text x="692" y="153" class="button" text-anchor="middle">Únete</text>
    </g>
    <rect x="40" y="184" width="720" height="420" fill="url(#hero${index})"/>
    <circle cx="720" cy="235" r="128" fill="none" stroke="${option.accent}" stroke-width="35" opacity=".18"/>
    <circle cx="675" cy="338" r="52" fill="${option.primary}" opacity=".1"/>
    <rect x="82" y="225" width="248" height="36" rx="18" fill="${option.eyebrowBg}"/>
    <circle cx="102" cy="243" r="5" fill="${option.primary}"/>
    <text x="116" y="248" class="eyebrow">${esc(option.eyebrow)}</text>
    ${textLines(option.title, 82, 324, 'hero-title', 57)}
    ${textLines(option.subtitle, 82, 463, 'hero-copy', 25)}
    <g filter="url(#shadow${index})">
      <rect x="82" y="526" width="636" height="82" rx="18" fill="#FFFFFF"/>
    </g>
    <text x="112" y="576" class="search-text">⌕  ¿Qué estás buscando?</text>
    <line x1="398" y1="546" x2="398" y2="588" stroke="#071B46" opacity=".12"/>
    <text x="424" y="576" class="search-text">⌖  Baltimore, MD</text>
    <rect x="604" y="539" width="100" height="56" rx="13" fill="${option.primary}"/><text x="654" y="574" class="button" text-anchor="middle">Buscar</text>
    <text x="82" y="674" class="section-title">Explora por categoría</text><text x="690" y="673" class="link" text-anchor="end">Ver todas →</text>
    ${chips}
    <g>
      <rect x="82" y="783" width="303" height="286" rx="18" fill="#FFFFFF" stroke="#071B46" stroke-opacity=".1"/>
      <rect x="96" y="797" width="275" height="166" rx="13" fill="url(#photo1${index})"/>
      <circle cx="330" cy="838" r="54" fill="#fff" opacity=".1"/><path d="M105 934 C160 866 225 1005 363 846 L371 963 L96 963 Z" fill="#fff" opacity=".12"/>
      <rect x="110" y="914" width="118" height="31" rx="15" fill="#071B46" fill-opacity=".84"/><text x="169" y="934" class="status" text-anchor="middle">★ 4.9 · DESTACADO</text>
      <text x="103" y="1002" class="business">${esc(option.businesses[0][0])}</text><text x="103" y="1031" class="meta">${esc(option.businesses[0][1])}</text>
    </g>
    <g>
      <rect x="415" y="783" width="303" height="286" rx="18" fill="#FFFFFF" stroke="#071B46" stroke-opacity=".1"/>
      <rect x="429" y="797" width="275" height="166" rx="13" fill="url(#photo2${index})"/>
      <circle cx="655" cy="846" r="66" fill="#fff" opacity=".11"/><path d="M438 940 C515 856 596 1000 704 866 L704 963 L429 963 Z" fill="#fff" opacity=".12"/>
      <rect x="443" y="914" width="118" height="31" rx="15" fill="#071B46" fill-opacity=".84"/><text x="502" y="934" class="status" text-anchor="middle">ABIERTO AHORA</text>
      <text x="436" y="1002" class="business">${esc(option.businesses[1][0])}</text><text x="436" y="1031" class="meta">${esc(option.businesses[1][1])}</text>
    </g>
    <text x="60" y="1230" class="option-label">DIRECCIÓN ${option.code}</text>
    <text x="60" y="1272" class="option-name">${esc(option.name)}</text>
    ${textLines(option.description, 60, 1312, 'description', 27)}
    ${traits}
  </svg>`;
}

(async () => {
  await Promise.all(options.map((option, index) => sharp(Buffer.from(render(option, index))).png().toFile(option.file)));
})();
