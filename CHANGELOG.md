# Changelog

## Próxima versión

### Corregido

- Contraste AA en insignias, promociones, estados y enlaces publicitarios.
- Selects portaled visibles sobre drawers y dialogs.
- Layout estable de Toast, Identity Capsule y Community Hub en móvil y escritorio.
- Contenedores administrativos y del directorio sin overflow horizontal de página.

### Añadido

- Adaptadores neutrales para `next/link` y `next/image` mediante `LinkComponent`, `CardLink asChild` y `MediaFrame`.
- `StaticDataTable` server-safe y frontera cliente explícita para `DataTable` interactiva.
- Iconografía SVG consistente y accesible basada en el lenguaje Lucide.
- Tema `mercado-nocturno`, variante oscura de Mercado contemporáneo.

## 0.1.0 — 2026-08-13

### Añadido

- Fundaciones encapsuladas: reset, tokens, temas, densidades, layout, tipografía, accesibilidad, movimiento reducido e impresión.
- Componentes React/Radix para acciones, identidad, formularios, navegación, overlays, feedback, contenido y datos.
- Lenguaje distintivo Path Button, Relay Button, Split Bridge, Action Rail, Linked CTA, Avatar Weave, Identity Capsule y Community Hub.
- Patrones públicos para búsqueda, filtros, tarjetas y perfiles de negocios, promociones, reclamos y publicidad identificada.
- Patrones administrativos compactos para navegación, encabezados, filtros, edición rápida, estados de publicación y actividad.
- Historias Storybook, pruebas Vitest/axe, recorridos Playwright, auditoría anti-conflictos y presupuesto CSS de 30 KB gzip.

### Decisiones

- Red Latina usa exclusivamente Mercado contemporáneo; las direcciones visuales alternativas permanecen solo como historial.
- La integración inicial se distribuye como carpeta/paquete local y se migra por rutas verificables antes de eliminar CSS heredado.
