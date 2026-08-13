# Migrar a Voreal UI

La migración se hace por rutas funcionales, no con un reemplazo masivo de clases. El objetivo es conservar URLs, datos, permisos, analytics y comportamiento mientras cambia el lenguaje visual.

## 1. Inventario reproducible

Antes de editar, registra versiones reales de Next, React, Tailwind y Radix; imports CSS globales; CSS Modules; clases manuales; colores; `!important`; capas y `z-index`.

Ejecuta primero en modo informe:

```bash
node ../Voreal-ui/scripts/audit-css.mjs src --report
```

Repite el inventario dos veces y conserva una salida estable. Elige una ruta pública representativa y una administrativa usando la frecuencia real de componentes.

## 2. Alinea dependencias

- Con Tailwind v4 compatible, reutiliza la instalación del host.
- Con Tailwind v3, usa inicialmente el CSS Voreal ya procesado o una copia aislada; planifica la actualización de Tailwind por separado.
- Mantén las versiones Radix del host cuando satisfagan el comportamiento probado.
- No cargues Bootstrap, Semantic UI o UIkit solo para reproducir componentes Voreal; encapsula integraciones que deban permanecer.

## 3. Copia la unidad completa

```bash
mkdir -p src/voreal
cp -R ../Voreal-ui/src/. src/voreal/
```

No copies solo un botón: los componentes dependen de tokens, reset encapsulado, utilidades y propagación de tema a portales.

## 4. Establece el orden de estilos

```css
/* src/app/globals.css */
@import "../voreal/styles/index.css";
@import "../styles/vendor.css" layer(vendor);
@import "../styles/legacy-bridge.css" layer(app);
```

El puente heredado debe ser corto, comentado y temporal. No añadas nuevos colores de marca ni `!important` allí.

Envuelve únicamente las rutas migradas al principio:

```tsx
import { VorealRoot } from "@/voreal";

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <VorealRoot theme="red-latina">{children}</VorealRoot>;
}
```

Para administración usa `density="compact"`.

## 5. Caracteriza y migra por superficie

Antes del cambio visual, escribe pruebas sobre comportamiento existente:

- pública: encabezado, búsqueda, filtros, URL de negocio, lista/mapa, carga, vacío y error;
- administrativa: permisos, filtros, selección, edición, guardado, confirmación destructiva y estados.

Migra primero esas dos rutas. Sustituye componentes visuales sin tocar fetching, mutaciones, routing ni analytics en el mismo commit.

## 6. Controla conflictos

Durante la transición:

```bash
# El legado informa, pero aún no bloquea.
node scripts/audit-css.mjs src/legacy --report

# Voreal y las rutas migradas sí bloquean.
node scripts/audit-css.mjs src/voreal src/app/directorio src/app/admin
```

Las clases públicas Voreal usan prefijo `vr-`, el reset está limitado a `.vr-root`/`[data-vr-root]`, y los portales usan `[data-vr-portal]`. No elimines esos límites.

## 7. Elimina CSS heredado con evidencia

1. Construye el grafo de imports/selectores y elimina primero archivos sin consumidores.
2. Retira estilos ruta por ruta después de pasar pruebas funcionales y visuales.
3. Conserva un archivo puente solo si tiene consumidores documentados.
4. Ejecuta toda la batería Voreal, el build del host y las rutas Playwright.
5. Compara el inventario final con el inicial y confirma que los selectores viejos ya no tienen consumidores.

No borres miles de líneas por conteo: bórralas cuando el grafo, las pruebas y las rutas migradas demuestren que dejaron de ser necesarias.
