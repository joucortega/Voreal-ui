const sharp = require('sharp');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1520" viewBox="0 0 1000 1520">
  <defs>
    <filter id="shadow" x="-30%" y="-40%" width="170%" height="200%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#071B46" flood-opacity=".13"/>
    </filter>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FFF8E9"/><stop offset="1" stop-color="#E8F7E4"/>
    </linearGradient>
    <style>
      text { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .eyebrow { font-size: 15px; font-weight: 850; letter-spacing: 2.2px; fill: #C83B20; }
      .title { font-size: 42px; font-weight: 850; letter-spacing: -1.4px; fill: #071B46; }
      .lead { font-size: 19px; font-weight: 450; fill: #526176; }
      .section { font-size: 25px; font-weight: 820; fill: #071B46; }
      .caption { font-size: 15px; font-weight: 500; fill: #66758A; }
      .button { font-size: 18px; font-weight: 800; }
      .small-button { font-size: 15px; font-weight: 780; }
      .tiny { font-size: 12px; font-weight: 800; letter-spacing: .5px; }
      .name { font-size: 17px; font-weight: 800; fill: #071B46; }
      .role { font-size: 13px; font-weight: 550; fill: #66758A; }
    </style>
  </defs>

  <rect width="1000" height="1520" fill="#F1F4F7"/>
  <rect x="48" y="40" width="904" height="1440" rx="34" fill="#FFFFFF"/>
  <rect x="48" y="40" width="904" height="226" rx="34" fill="url(#warm)"/>
  <rect x="48" y="232" width="904" height="34" fill="url(#warm)"/>
  <circle cx="902" cy="92" r="108" fill="none" stroke="#39D353" stroke-width="30" opacity=".17"/>
  <text x="92" y="92" class="eyebrow">VOREAL UI · INTERACTION LANGUAGE</text>
  <text x="92" y="148" class="title">Acciones que se relacionan</text>
  <text x="92" y="185" class="lead">Los controles no solo se agrupan: expresan contexto, continuidad</text>
  <text x="92" y="214" class="lead">y comunidad sin depender de animaciones pesadas.</text>

  <text x="92" y="322" class="section">1. Familia de botones</text>
  <text x="92" y="351" class="caption">La silueta cambia según la relación entre acciones, no por decoración arbitraria.</text>

  <!-- Primary / Path -->
  <g filter="url(#shadow)">
    <rect x="92" y="394" width="262" height="66" rx="18" fill="#C83B20"/>
  </g>
  <circle cx="126" cy="427" r="18" fill="#FFFFFF" fill-opacity=".16"/>
  <path d="M118 427h14m-5-5 5 5-5 5" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="153" y="434" class="button" fill="#fff">Explorar negocios</text>
  <text x="92" y="491" class="name">Path Button</text>
  <text x="92" y="515" class="role"><tspan x="92">El icono ocupa un carril y guía</tspan><tspan x="92" dy="20">la dirección de la acción.</tspan></text>

  <!-- Relay -->
  <g filter="url(#shadow)">
    <rect x="510" y="394" width="352" height="66" rx="18" fill="#071B46"/>
    <rect x="726" y="400" width="130" height="54" rx="14" fill="#16325F"/>
  </g>
  <circle cx="546" cy="427" r="5" fill="#39D353"/>
  <text x="566" y="434" class="button" fill="#fff">Llamar ahora</text>
  <text x="791" y="432" class="tiny" fill="#BDF4C7" text-anchor="middle">ABIERTO</text>
  <text x="510" y="491" class="name">Relay Button</text>
  <text x="510" y="515" class="role"><tspan x="510">La acción transporta su contexto</tspan><tspan x="510" dy="20">en una cápsula conectada.</tspan></text>

  <!-- Split -->
  <g filter="url(#shadow)">
    <path d="M92 568 Q92 550 110 550 H332 Q350 550 350 568 V598 Q350 616 332 616 H110 Q92 616 92 598Z" fill="#C83B20"/>
    <path d="M310 550 H392 Q410 550 410 568 V598 Q410 616 392 616 H310 Q326 583 310 550Z" fill="#B9321B"/>
  </g>
  <text x="132" y="591" class="button" fill="#fff">Guardar negocio</text>
  <path d="m357 579 8 8 8-8" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="92" y="648" class="name">Split Bridge</text>
  <text x="92" y="672" class="role"><tspan x="92">La unión curva separa acción y menú</tspan><tspan x="92" dy="20">sin convertirlos en dos cajas.</tspan></text>

  <!-- Rail -->
  <g transform="translate(510 550)" filter="url(#shadow)">
    <rect width="352" height="66" rx="20" fill="#FFF9EF" stroke="#E1D7C7"/>
    <rect x="6" y="6" width="112" height="54" rx="15" fill="#071B46"/>
    <line x1="235" y1="15" x2="235" y2="51" stroke="#071B46" opacity=".12"/>
    <text x="62" y="40" class="small-button" fill="#fff" text-anchor="middle">Lista</text>
    <text x="176" y="40" class="small-button" fill="#526176" text-anchor="middle">Mapa</text>
    <text x="294" y="40" class="small-button" fill="#526176" text-anchor="middle">Guardados</text>
  </g>
  <text x="510" y="648" class="name">Action Rail</text>
  <text x="510" y="672" class="role"><tspan x="510">Cada estación es independiente,</tspan><tspan x="510" dy="20">pero comparte un solo recorrido.</tspan></text>

  <!-- Linked CTA -->
  <g filter="url(#shadow)">
    <rect x="92" y="726" width="770" height="84" rx="22" fill="#FFF9EF" stroke="#E5D9C8"/>
    <circle cx="135" cy="768" r="26" fill="#FF5C35"/>
    <path d="M125 768h20m-8-8 8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="177" y="760" class="name">¿Este es tu negocio?</text>
    <text x="177" y="785" class="role">Reclámalo y completa su información.</text>
    <rect x="655" y="739" width="194" height="58" rx="16" fill="#C83B20"/>
    <text x="752" y="775" class="button" fill="#fff" text-anchor="middle">Reclamar perfil</text>
  </g>
  <text x="92" y="842" class="name">Linked CTA</text>
  <text x="92" y="866" class="role">Mensaje, identidad y acción viven juntos; en móvil se apilan sin romperse.</text>

  <line x1="92" y1="916" x2="908" y2="916" stroke="#071B46" opacity=".1"/>
  <text x="92" y="973" class="section">2. Familia de identidad y comunidad</text>
  <text x="92" y="1002" class="caption">Inspirada en avatar groups, pero muestra relaciones y estados, no solo círculos apilados.</text>

  <!-- Avatar Weave -->
  <g transform="translate(92 1042)">
    <path d="M48 48 C92 18 126 78 170 48 C214 18 248 78 292 48" fill="none" stroke="#F0C9B9" stroke-width="10" stroke-linecap="round"/>
    <circle cx="48" cy="48" r="40" fill="#E7A37E" stroke="#fff" stroke-width="6"/>
    <circle cx="129" cy="48" r="40" fill="#2E7956" stroke="#fff" stroke-width="6"/>
    <circle cx="210" cy="48" r="40" fill="#D26A49" stroke="#fff" stroke-width="6"/>
    <circle cx="291" cy="48" r="40" fill="#071B46" stroke="#fff" stroke-width="6"/>
    <text x="291" y="55" class="button" fill="#fff" text-anchor="middle">+8</text>
  </g>
  <text x="92" y="1165" class="name">Avatar Weave</text>
  <text x="92" y="1189" class="role"><tspan x="92">El hilo visible comunica colaboración;</tspan><tspan x="92" dy="20">foco y tooltip revelan cada persona.</tspan></text>

  <!-- Identity Capsule -->
  <g transform="translate(510 1042)" filter="url(#shadow)">
    <rect width="352" height="92" rx="24" fill="#FFFFFF" stroke="#DCE2E8"/>
    <circle cx="51" cy="46" r="32" fill="#E7A37E"/>
    <text x="96" y="40" class="name">Ana Martínez</text>
    <text x="96" y="64" class="role">Propietaria · En línea</text>
    <circle cx="319" cy="46" r="17" fill="#E8F8E9"/>
    <circle cx="319" cy="46" r="5" fill="#2E9B50"/>
  </g>
  <text x="510" y="1165" class="name">Identity Capsule</text>
  <text x="510" y="1189" class="role"><tspan x="510">Persona, función y presencia</tspan><tspan x="510" dy="20">en una unidad accionable.</tspan></text>

  <!-- Community Hub -->
  <g transform="translate(92 1250)">
    <path d="M91 73 28 30M91 73l72-45M91 73l72 78M91 73l-64 73" stroke="#E7D9C5" stroke-width="7" stroke-linecap="round"/>
    <circle cx="91" cy="73" r="49" fill="#071B46" stroke="#FFF9EF" stroke-width="8"/>
    <text x="91" y="83" font-size="31" font-weight="900" fill="#fff" text-anchor="middle">RL</text>
    <circle cx="28" cy="30" r="25" fill="#E7A37E" stroke="#fff" stroke-width="5"/>
    <circle cx="163" cy="28" r="25" fill="#2E7956" stroke="#fff" stroke-width="5"/>
    <circle cx="163" cy="151" r="25" fill="#D26A49" stroke="#fff" stroke-width="5"/>
    <circle cx="27" cy="146" r="25" fill="#E8C37E" stroke="#fff" stroke-width="5"/>
  </g>
  <text x="310" y="1305" class="name">Community Hub</text>
  <text x="310" y="1332" class="role">El negocio es el centro; sus administradores aparecen como red.</text>
  <text x="310" y="1356" class="role">Se reserva para relaciones relevantes, no para decorar cada tarjeta.</text>

  <rect x="92" y="1410" width="816" height="1" fill="#071B46" opacity=".1"/>
  <text x="92" y="1443" class="caption">Todas las variantes conservan HTML semántico, foco visible, carga y estado deshabilitado.</text>
</svg>`;

sharp(Buffer.from(svg)).png().toFile('voreal-actions-identity.png');
