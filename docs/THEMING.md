# Crear un tema Voreal

Un tema nuevo cambia decisiones semánticas —superficie, texto, acción, estados y foco— sin modificar componentes. `VorealRoot` incluye `neutral`, `red-latina` y `mercado-nocturno`, y también acepta identificadores propios.

`mercado-nocturno` es una variante nocturna de Mercado contemporáneo, no una segunda dirección visual. Actívala con `<VorealRoot theme="mercado-nocturno">` o desde el selector de tema de Storybook.

## 1. Define el contrato completo

Crea `mi-marca.css` después de importar `styles.css`. Usa `layer(app)` para que el tema del producto prevalezca de forma predecible:

```css
@layer app {
  :where(.vr-root, [data-vr-root], [data-vr-portal])[data-vr-theme="mi-marca"] {
    color-scheme: light;

    --vr-canvas: #f7f8fc;
    --vr-surface: #fff;
    --vr-surface-muted: #edf1f7;
    --vr-surface-raised: #fff;
    --vr-text: #15213a;
    --vr-text-muted: #5c687c;
    --vr-border: #d7deea;
    --vr-border-strong: #aeb9ca;

    --vr-action: #2457c5;
    --vr-action-hover: #1c459e;
    --vr-action-foreground: #1c459e;
    --vr-action-soft: #e0eaff;
    --vr-on-action: #fff;
    --vr-accent: #9ac7ff;
    --vr-on-accent: #102548;

    --vr-success: #23724a;
    --vr-success-surface: #def5e8;
    --vr-on-success: #fff;
    --vr-warning: #875000;
    --vr-warning-surface: #fff0c7;
    --vr-on-warning: #382000;
    --vr-danger: #ad2921;
    --vr-danger-surface: #fde5e3;
    --vr-on-danger: #fff;

    --vr-focus: #1155cc;
    --vr-focus-contrast: #fff;
    --vr-selection: #dce8ff;
    --vr-on-selection: #102548;
  }
}
```

Los valores anteriores forman el contrato mínimo. `--vr-action-foreground` se usa para texto y enlaces sobre superficies claras, mientras `--vr-action` conserva el color de controles sólidos. Los componentes consumen estas variables semánticas; no necesitan conocer la paleta original.

## 2. Activa el tema

```tsx
import "@voreal/ui/styles.css";
import "./mi-marca.css";
import { VorealRoot } from "@voreal/ui";

export function App({ children }: { children: React.ReactNode }) {
  return <VorealRoot theme="mi-marca">{children}</VorealRoot>;
}
```

Los portales propios deben recibir `useVorealPortalProps()`. Los portales de Voreal ya lo hacen automáticamente.

## 3. Ajustes opcionales

Puedes redefinir tipografía, radios o sombras en el mismo selector:

```css
@layer app {
  [data-vr-theme="mi-marca"] {
    --vr-font-heading: "Avenir Next", ui-sans-serif, system-ui, sans-serif;
    --vr-radius-control: 0.625rem;
    --vr-radius-card: 1rem;
    --vr-shadow-1: 0 2px 10px rgb(21 33 58 / 8%);
  }
}
```

No cambies alturas o espaciado por tema salvo que sea un requisito real; para eso existe `density="compact"`.

## 4. Verifica antes de compartir

1. Revisa texto normal, texto grande, foco y estados contra WCAG AA.
2. Prueba `Button`, `Field`, `Select`, `Dialog`, `Toast`, `BusinessCard`, `DataTable` y `PublicationStatus`.
3. Confirma portales, teclado, `prefers-reduced-motion`, forced colors e impresión.
4. Ejecuta `pnpm test:a11y`, `pnpm audit:css`, `pnpm build-storybook` y `pnpm budget:css`.
5. Añade una historia de tokens para la nueva marca; no dupliques componentes para cambiar colores.
