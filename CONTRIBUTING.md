# Cómo contribuir

Gracias por tu interés. Este proyecto es una aplicación de estudio de vocabulario
que funciona sin conexión. Antes de escribir código, lee `AGENTS.md`, `DESIGN.md`
y `docs/architecture.md`: describen límites que el linter hace cumplir y no son
sugerencias.

## Preparar el entorno

Requisitos: Node.js 20 o superior. Para probar en un teléfono, Expo Go.

```bash
git clone https://github.com/nosoypoot/nihongonokotoba.git
cd nihongonokotoba
npm install
npm start
```

Escanea el QR con Expo Go para Android. En macOS, `npm run ios` abre el simulador
de iPhone. `npm run web` levanta la versión de navegador.

## Antes de abrir un pull request

Corre las cuatro verificaciones. Todas deben pasar:

```bash
npm run validate:content   # valida el esquema de los paquetes de contenido
npm run lint               # incluye las reglas de límites entre capas
npm run typecheck
npm test
```

## Reglas de arquitectura

Las dependencias fluyen en una sola dirección:

```text
app → features → data → core
```

- `src/core/` no puede importar React Native, Expo ni SQLite. Es lógica pura.
- Solo `src/data/` puede importar `expo-sqlite`.
- Solo `src/core/scheduling/` puede importar `ts-fsrs`.
- Las pantallas de `app/` componen features; no contienen SQL ni reglas de
  programación de repasos.
- La aplicación debe seguir siendo completamente usable sin red.

`eslint-plugin-boundaries` verifica esto, así que un PR que rompa una capa falla
en `npm run lint` antes de la revisión.

## Contribuir contenido

Un paquete de contenido es la parte del proyecto con más requisitos legales,
porque es material educativo publicado. Cada paquete debe declarar:

- `authors`, `license` (nombre y URL) y `sourceNotes` verificables.
- Significados en español **y** en inglés.
- IDs estables. Un ID de tarjeta es `courseId:entryId:templateId:senseId`.

Además:

- El contenido debe ser original, de dominio público o con licencia compatible.
- No copies listas, traducciones ni explicaciones de libros o cursos comerciales.
  Puedes usar material privado para definir el *alcance* de una lección, pero cada
  traducción, explicación y ejemplo que llegue al repositorio debe escribirse y
  revisarse de forma independiente.
- Los metadatos no pueden dar a entender afiliación con ningún libro comercial.
- No subas PDFs ni escaneos de material de estudio. `docs/References/` está
  ignorado por Git a propósito.

Ver `docs/content-sources.md` para las reglas completas de publicación.

Cambiar la forma objetivo de una palabra, su sentido principal, la identidad de
una lección o la identidad de una tarjeta rompe el historial de estudio de la
gente. Eso requiere un mapa de migración, o un ID nuevo más una lápida
(*tombstone*). Las correcciones de redacción puramente cosméticas conservan el
progreso.

El paquete de maya yucateco es solo un fixture del esquema, no un curso. Solo se
convertiría en curso con una persona calificada que revise ortografía, dialecto,
ejemplos, traducciones y licencia.

## Diseño

`DESIGN.md` define tipografía, color, espaciado, movimiento y accesibilidad. Dos
reglas que se rompen con facilidad:

- Sin puntos, rachas ni recompensas sintéticas. La palabra es el premio.
- Sin rojo ni lenguaje de vergüenza para una respuesta olvidada, y nunca uses el
  color como único medio para comunicar un resultado.

Objetivo de accesibilidad: WCAG AA (4.5:1 en texto normal, 3:1 en texto grande),
áreas táctiles de 44 × 44 dp como mínimo, y ninguna acción obligatoria que dependa
de un deslizamiento, un hover, una pulsación larga o la orientación.

## Despliegue web

El despliegue usa Cloudflare Workers. El identificador de cuenta no vive en el
repositorio; expórtalo antes de desplegar:

```bash
export CLOUDFLARE_ACCOUNT_ID=<tu-account-id>
npm run deploy:web
```

Si solo quieres el bundle estático, `npm run build:web` deja la salida en `dist/`.

## Pull requests

- Una preocupación por PR, con un título que describa el cambio.
- Explica el *por qué*, no solo el *qué*, sobre todo si tocas programación de
  repasos, identidad de tarjetas o almacenamiento.
- Agrega pruebas para lógica nueva en `src/core/` y para repositorios nuevos.
- No subas secretos, `.env`, claves de firma ni credenciales de cuenta. `.gitignore`
  cubre los casos comunes, pero revisa tu diff.

## Licencia

El código se contribuye bajo la licencia MIT (ver `LICENSE`). El contenido se
publica bajo la licencia declarada en cada paquete: CC0-1.0 o CC-BY-4.0 según el
paquete. Al enviar un PR confirmas que tienes derecho a aportar ese material bajo
esas licencias.
