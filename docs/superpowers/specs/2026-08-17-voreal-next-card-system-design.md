# Voreal Next: sistema visual cohesivo basado en tarjetas

**Fecha:** 2026-08-17  
**Estado:** aprobado por el usuario para implementación aislada

## 1. Decisión

Voreal Next será una versión opt-in y aislada dentro del repositorio de Voreal. No reemplazará los estilos, exportaciones ni temas actuales. Su referencia visual es la pantalla completa de directorio con tarjetas compactas aprobada durante la sesión de diseño, incluyendo:

- logotipo y encabezado global;
- navegación superior;
- buscador compuesto;
- resumen de resultados y ordenamiento;
- etiquetas de filtros activos;
- sidebar de categorías y filtros;
- tarjetas de negocios;
- tipografía, iconografía, estados y densidad;
- reglas responsive para desktop, tablet y móvil.

La presentación principal de Red Latina será la cuadrícula de tarjetas. Las listas seguirán existiendo en Voreal Next para administración, tablas y contextos de alta densidad, pero no definirán la experiencia pública del directorio.

## 2. Objetivo

Crear un sistema visual moderno, rápido, estable y reutilizable que se perciba como un solo producto. La cohesión debe provenir de reglas compartidas, no de componentes diseñados individualmente.

Voreal Next sintetiza tres cualidades de referencia:

- Carbon Design System: simplicidad, cuadrícula modular, precisión y poco adorno.
- Semantic UI: parentesco visible entre todos los componentes.
- Atlassian Design System: organización, jerarquía tipográfica y composición sistemática.

La identidad latina se expresará mediante idioma, nombres, fotografías auténticas, contenido y contexto comunitario. No se usarán banderas, patrones folclóricos, colores de fiesta ni otros clichés como sustitutos del diseño.

## 3. Aislamiento de la versión existente

### 3.1 Entradas públicas

La versión nueva se consumirá explícitamente:

```tsx
import {
  VorealNextRoot,
  DirectoryCardGrid,
} from "@voreal/ui/next";
import "@voreal/ui/next/styles.css";
```

Se añadirán entradas independientes:

- `@voreal/ui/next`
- `@voreal/ui/next/styles.css`
- `@voreal/ui/next/components/*`
- `@voreal/ui/next/patterns/directory`

Las entradas actuales —incluyendo `@voreal/ui`, `@voreal/ui/styles.css` y los temas existentes— conservarán su comportamiento.

### 3.2 Alcance CSS

Voreal Next vivirá bajo un root propio:

```html
<div data-voreal-ui="next">...</div>
```

Reglas de aislamiento:

- clases internas con prefijo `.vrn-`;
- variables con prefijo `--vrn-`;
- portales bajo `[data-vrn-portal]`;
- selectores de baja especificidad con `:where()`;
- ningún reset global fuera de `[data-voreal-ui="next"]`;
- capas CSS separadas: `vrn-reset`, `vrn-tokens`, `vrn-components`, `vrn-patterns` y `vrn-utilities`;
- ningún selector de Voreal Next podrá depender de una clase `.vr-*` existente.

Esto permitirá renderizar Voreal actual y Voreal Next en una misma página sin contaminación visual.

### 3.3 Storybook

Las historias nuevas vivirán bajo `Next/Foundations`, `Next/Components` y `Next/Patterns`. Las historias actuales permanecerán visibles y sin cambios para facilitar comparación y migración.

## 4. Lenguaje visual

### 4.1 Cuadrícula y contenedores

- Desktop: contenedor máximo de `1440px`, gutters de `24–32px` y cuadrícula de 12 columnas.
- Tablet: gutters de `24px` y cuadrícula de 8 columnas.
- Móvil: gutters de `16px` y cuadrícula de 4 columnas.
- La alineación entre header, buscador, resumen, sidebar y tarjetas será compartida.
- No se crearán paneles flotantes para secciones que puedan resolverse con alineación, espacio o divisores.

### 4.2 Escala de espacio

La escala será limitada:

```text
0, 4, 8, 12, 16, 24, 32, 40, 48, 64px
```

Reglas:

- `8px` es la unidad compositiva principal;
- `12–16px` para separación interna de controles y tarjetas;
- `24–32px` para separar grupos de contenido;
- `40–64px` solo para secciones completas;
- no habrá espacios arbitrarios ni secciones públicas con padding vertical de `80–96px`.

### 4.3 Color

Paleta inicial de Voreal Next:

```text
Canvas             #F7F9FC
Surface            #FFFFFF
Surface muted      #F1F4F8
Ink                #0B1F3A
Text muted         #5D6B82
Border             #DDE3EC
Border strong      #BAC4D2
Primary            #0F5BDE
Primary hover      #0A47B8
Primary soft       #EAF1FF
Success            #237B4B
Success soft       #E8F5ED
Warning            #946200
Danger             #B42318
Clay accent        #C4512F
```

El azul es la acción principal y el foco visual. Verde, dorado y rojo se reservan para estados. El acento clay se utilizará en momentos comunitarios muy puntuales; nunca competirá con la acción primaria.

### 4.4 Tipografía

- Stack por defecto: `Inter, ui-sans-serif, system-ui, sans-serif`.
- Voreal no forzará una descarga de fuente; el consumidor podrá proporcionar Inter.
- Body: `14–16px`.
- Labels y metadatos: `12–14px`.
- Títulos de tarjeta: `18px`.
- Títulos de página: `28–34px`.
- Ningún título funcional del directorio superará `40px`.
- Máximo dos pesos dominantes por composición: regular y semibold; bold queda reservado para énfasis real.

### 4.5 Radio, borde y elevación

- Controles: `4–6px`.
- Tarjetas: `6–8px`.
- Paneles y overlays: `8–10px`.
- Pills solo para estados o selecciones que semánticamente lo requieran.
- Borde neutral de `1px` como separación predeterminada.
- Sombras casi inexistentes; overlays pueden usar una sola elevación moderada.
- Hover de tarjetas mediante borde, fondo o desplazamiento máximo de `1px`; no habrá saltos de `2px` ni animaciones teatrales.

### 4.6 Movimiento

- Duraciones: `120ms`, `180ms` y `240ms`.
- El movimiento comunicará hover, selección, expansión o cambio de estado.
- `prefers-reduced-motion` eliminará desplazamiento y reducirá transiciones.
- No habrá animaciones constantes ni movimiento decorativo.

## 5. Composición del directorio aprobado

### 5.1 Header y logotipo

- Altura desktop aproximada: `64px`.
- Logotipo Voreal alineado con la cuadrícula, compacto y sin bloque decorativo alrededor.
- Descriptor “Directorio de negocios latinos” como contexto secundario.
- Navegación derecha: “Para negocios”, “Listar mi negocio”, “Recursos”, “Favoritos” y menú de cuenta.
- En móvil, navegación secundaria dentro de un menú accesible; logo y acción principal permanecen visibles.

### 5.2 Buscador compuesto

- Una superficie horizontal con campo de consulta, campo de ubicación y botón Buscar.
- Altura visual de `56–64px` para el conjunto; controles internos alineados a una misma línea base.
- Labels pequeños encima del valor para distinguir intención sin placeholders ambiguos.
- Divisor interno entre campos en desktop.
- En móvil, los campos se apilan dentro de la misma sección y el botón ocupa el ancho disponible.
- Estados: idle, hover, focus, valor, error, disabled y loading.

### 5.3 Resumen, tags y ordenamiento

- Título conciso con consulta y ubicación.
- Conteo de resultados en una línea secundaria.
- Filtros activos en chips rectangulares compactos, con cierre accesible.
- Acción “Limpiar todo” tratada como enlace secundario.
- Ordenamiento alineado al extremo derecho en desktop y dentro de la toolbar móvil.
- Los tags compartirán altura, radio, iconos, padding y tipografía con selects y botones secundarios.

### 5.4 Sidebar

- Ancho desktop aproximado: `248–272px`.
- Fondo integrado a la página; no será una tarjeta independiente.
- Grupos: categoría, ubicación, idioma, verificado y abierto ahora.
- Separación por divisores y títulos semibold; no por cajas anidadas.
- Conteos alineados al extremo derecho.
- Desktop: visible y opcionalmente sticky.
- Tablet: colapsable.
- Móvil: drawer accesible con resumen de filtros activos y botones Aplicar/Limpiar.

### 5.5 Cuadrícula de tarjetas

- Desktop amplio: tres columnas.
- Tablet: dos columnas.
- Móvil: una columna.
- Gap: `24px` desktop y `16px` móvil.
- Las tarjetas de una fila mantienen altura coherente sin esconder contenido esencial.

Anatomía obligatoria de cada tarjeta:

1. fotografía real en proporción `3:2`, con altura controlada de aproximadamente `144–168px`;
2. favorito en posición consistente;
3. categoría;
4. nombre del negocio;
5. descripción de máximo dos líneas;
6. ubicación y distancia;
7. rating y reseñas;
8. estado abierto/cerrado y verificación;
9. acción “Ver negocio” alineada al borde inferior.

El contenido podrá variar, pero la anatomía, el orden, las líneas base y el espacio no variarán entre tarjetas.

## 6. Cobertura de la entrega de validación

La primera entrega de Voreal Next será deliberadamente estrecha. Su objetivo es validar la dirección visual completa en el directorio antes de trasladarla al resto de Voreal.

### Fundaciones incluidas

- root y reset aislados;
- tokens primitivos, semánticos y de componente;
- tipografía;
- container, stack, cluster, grid y divider necesarios para la composición;
- iconografía Lucide o adaptador equivalente con tamaño y stroke normalizados.

### Componentes incluidos

- button e icon button;
- field, input, select y checkbox;
- search compound;
- chips/tags;
- header, navegación desktop y menú móvil;
- card, media y badge;
- sidebar/filter panel desktop y drawer de filtros móvil;
- estados loading, vacío y error del directorio.

### Patrón incluido

- pantalla pública completa del directorio;
- buscador, filtros activos, categorías, sidebar, ordenamiento y paginación;
- cuadrícula responsive de tarjetas de negocios;
- estados de datos parciales, fotografía ausente, cero resultados y error recuperable.

### Cobertura diferida hasta la aprobación visual

Voreal Next no migrará todavía textarea, combobox, radio, switch, button group, toggle group, tabs, breadcrumbs, dropdowns genéricos, dialog, alert dialog, popover, tooltip, toast, alert, progress, tablas, listas densas ni el shell administrativo. Estas familias conservarán la implementación Voreal actual hasta que el usuario apruebe la entrega de validación.

## 7. Arquitectura React y Next.js

- Los componentes puramente visuales serán compatibles con Server Components.
- Solo los componentes interactivos declararán `"use client"`.
- Enlaces aceptarán un adaptador `LinkComponent` compatible con `next/link`.
- Medios aceptarán un adaptador `ImageComponent` compatible con `next/image`, conservando dimensiones, `sizes`, carga y estabilidad visual.
- Voreal Next no hará fetch ni impondrá un backend. Search, filtros, ordenamiento y paginación serán controlados mediante props y callbacks.
- Los componentes no expondrán detalles internos de Radix; Radix se usará como base de comportamiento accesible.

Flujo de datos del directorio:

```text
estado de la aplicación
  -> props controladas de búsqueda/filtros/orden
  -> composición DirectoryShell
  -> Sidebar + ResultSummary + DirectoryCardGrid
  -> eventos semánticos al consumidor
  -> actualización de URL, servidor o estado local por la aplicación
```

El usuario final verá mensajes cortos y accionables. Datos técnicos, causas y telemetría quedarán disponibles para logging del consumidor, no dentro de la interfaz pública.

## 8. Compatibilidad, estabilidad y conflictos

- React `18.3–19.x`.
- CSS moderno equivalente al soporte de Tailwind 4, sin perseguir navegadores obsoletos.
- Fallbacks precomputados para estilos críticos; `color-mix()` y container queries no serán requisitos de renderizado.
- Layout principal con grid/flex y media queries estables.
- Sin estilos sobre `html`, `body`, `button`, `input` u otros elementos fuera del root aislado.
- Orden de capas documentado para convivir con Tailwind, CSS Modules y estilos de aplicaciones consumidoras.
- El consumidor podrá importar solo los módulos necesarios; los componentes estáticos no añadirán JavaScript de interacción.

Presupuestos iniciales:

- entrada CSS completa de Voreal Next: máximo `24KB` gzip;
- CSS del patrón de directorio: máximo `8KB` gzip;
- cero dependencia de imágenes dentro del paquete base;
- cero JavaScript propio para Container, Stack, Text, Card y Media estáticos.

## 9. Accesibilidad

- WCAG 2.2 AA para texto y controles.
- Contraste de texto normal mínimo `4.5:1`.
- Foco visible de `2px` con offset coherente.
- Targets táctiles mínimos de `44px`; controles desktop pueden medir `40px` si su área interactiva conserva el mínimo necesario en touch.
- Orden de teclado idéntico al orden visual.
- Estados no dependerán únicamente del color.
- Imágenes requieren `alt` útil o tratamiento decorativo explícito.
- Drawer, menus, selects, dialogs y tooltips conservarán semántica y manejo de foco de Radix.

## 10. Estados y errores

Cada patrón público tendrá:

- loading estable sin saltos de layout;
- vacío inicial;
- cero resultados con acción para limpiar filtros;
- error recuperable con mensaje breve y retry;
- imagen ausente con fallback gráfico neutro, no iniciales gigantes;
- textos largos, nombre largo, sin reseñas, cerrado y datos parciales;
- contenido español e inglés.

Los toasts mostrarán un solo título, un mensaje opcional y una acción/cierre bien alineados. No permitirán superposición de textos.

## 11. Verificación

### Automatizada

- typecheck y build;
- tests unitarios de props, estados y composición;
- axe para historias interactivas y patrones;
- navegación completa por teclado;
- pruebas de adaptadores Next Link/Image;
- auditoría de select/drawer/portal y z-index;
- presupuestos CSS y detección de selectores no aislados.

### Visual

- snapshots de Storybook a `375px`, `768px`, `1024px` y `1440px`;
- comparación contra la referencia aprobada para header, búsqueda, filtros, sidebar, tags y tarjetas;
- revisión de contenido largo, seis tarjetas, cero resultados, loading y errores;
- Chromium, Firefox y WebKit dentro de la matriz vigente del proyecto.

### Criterio de éxito

Voreal Next se considera visualmente coherente cuando una captura sin contexto permite reconocer que header, buscador, sidebar, tags, tarjetas, botones, inputs y overlays pertenecen al mismo producto por compartir escala, geometría, color, iconografía y ritmo.

## 12. Secuencia de entrega

1. Crear el namespace, root, capas y tokens aislados.
2. Implementar tipografía, layout, iconos, botones y formularios esenciales para el directorio.
3. Implementar header, buscador compuesto, tags, select, checkbox y sidebar/drawer.
4. Implementar la tarjeta compacta y la cuadrícula responsive.
5. Componer el directorio de referencia completo y sus estados.
6. Añadir historias, edge cases, accesibilidad, compatibilidad y presupuestos.
7. Publicar Voreal Next en Storybook bajo una sección separada.
8. Detener la migración y solicitar aprobación visual antes de trasladar cualquier otra familia de componentes.

La versión actual seguirá siendo el valor predeterminado. Red Latina podrá adoptar Voreal Next mediante imports explícitos y migrar pantalla por pantalla.

## 13. Fuera de alcance inicial

- reemplazar o borrar Voreal actual;
- migrar automáticamente Red Latina;
- rediseñar las demás familias de componentes antes de aprobar el directorio de validación;
- crear temas visuales adicionales antes de estabilizar esta dirección;
- incluir lógica de búsqueda, backend, analytics o mapas dentro de Voreal;
- animaciones ornamentales o un sistema de motion avanzado.
