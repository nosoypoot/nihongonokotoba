# Nihongo no Kotoba

Aplicación offline para practicar vocabulario con repetición espaciada y
comprensión contextual. La primera experiencia enseña japonés; el formato de
contenido está diseñado para admitir otros idiomas sin cambiar el motor.

Funciona en Android, iOS y navegador, y sigue funcionando sin conexión después de
instalarse.

## Principios

- Funciona sin internet después de instalarse.
- No usa puntos, rachas ni recompensas.
- La palabra, su estructura y su uso son el centro de la experiencia.
- El progreso vive separado del contenido para que actualizar un curso no borre
  el historial.
- Los paquetes no afirman afiliación con libros o cursos comerciales.

## Cómo funciona el estudio

Una práctica enfocada toma primero las tarjetas que ya toca repasar y luego
introduce hasta cinco palabras nuevas de una sola lección. La persona revela la
respuesta y la califica: `Recordé`, `No recordé` o `Recordé mal`. Solo la
confirmación después del reveal cambia la programación de FSRS, pero las dos
señales quedan guardadas en un historial de intentos que nunca se sobrescribe.

Una palabra olvidada vuelve a aparecer después de dos tarjetas. FSRS se encarga
del calendario largo, con 90% de retención deseada. Tres prácticas enfocadas hacen
que una lección entre al repaso acumulativo.

## Desarrollo

Requisitos: Node.js 20 o superior y Expo Go para probar en un teléfono.

```bash
npm install
npm run validate:content
npm test
npm start
```

Escanea el QR con Expo Go en Android. En macOS también puedes ejecutar
`npm run ios` para abrir el simulador de iPhone aunque no tengas un iPhone físico,
o `npm run web` para la versión de navegador.

Verificaciones completas:

```bash
npm run validate:content
npm run lint
npm run typecheck
npm test
```

## Estructura

```text
app/           pantallas de Expo Router
src/features/  flujos de usuario y hooks
src/ui/        componentes y tokens visuales
src/data/      almacenamiento por plataforma y repositorios
src/core/      contratos de contenido, adaptador FSRS y estado puro de sesión
content/       paquetes de contenido incluidos en el build
tools/         validación de paquetes
```

Las dependencias fluyen `app → features → data → core`, y el linter lo hace
cumplir. `src/core` es lógica pura: no importa React Native, Expo ni SQLite.

En Android e iOS el almacenamiento usa Expo SQLite, con `content.db` desechable y
`progress.db` duradero. En web usa IndexedDB a través de `idb` con los mismos
contratos de repositorio.

## Despliegue web

```bash
export CLOUDFLARE_ACCOUNT_ID=<tu-account-id>
npm run deploy:web
```

`npm run build:web` genera solo el bundle estático en `dist/`.

## Contenido

Cada paquete declara autoría, licencia, notas de origen, significados en español e
inglés, e IDs estables. El paquete de japonés básico y el fixture de maya yucateco
están bajo CC0-1.0; las notas de estudio de japonés están bajo CC-BY-4.0. Revisa la
licencia declarada dentro de cada paquete antes de reutilizar contenido.

El paquete de maya yucateco existe solo para demostrar que el núcleo no está atado
al japonés. No es un curso publicable.

## Documentación

- `CONTRIBUTING.md` — cómo contribuir código y contenido
- `DESIGN.md` — sistema de diseño y decisiones visuales
- `docs/architecture.md` — capas, almacenamiento e identidad de tarjetas
- `docs/content-sources.md` — reglas de procedencia y publicación de contenido
- `docs/roadmap.md` — qué está hecho y qué sigue
- `docs/security.md` — postura de dependencias y datos

## Licencia

Código bajo licencia MIT (ver `LICENSE`). El contenido usa la licencia declarada
en cada paquete.
