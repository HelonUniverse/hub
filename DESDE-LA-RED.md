# Desde la Red — dónde vive cada cosa

App: https://app.desdelared.net  ·  Este repositorio guarda todo el código.

## Se publica solo al guardar en GitHub (en ~5 minutos)
- `dlr/pages/*.html` — pantallas: cursos, tarot, códigos, biodecodificación, pináculo…
- `dlr/audio/` — audios de los cursos.  `dlr/tiles/` — imágenes.

## Necesita publicarse (lo hace Claude) 
- `dlr/hub/app.js` y `dlr/hub/app.css` — el app principal (inicio, menús, Dones/Dharma).
- `deploy/` — la "carcasa": `index.html` (con `__SHA__` que se cambia por el commit de app.js/app.css), `api/_proxy.js` (conecta los apps externos), `vercel.json`, `manifest.json`, `sw.js`, `unify.*`, `musica.html`, `cards-data.js`, `logo.webp`.

## Supabase (proyecto xjmgtzlezsmpxfnyjrli)
- `supabase/functions/*/index.ts` — funciones del servidor (cursos, tarot, oráculo, pináculo, cristales, geometría, whatsapp). Las claves (ANTHROPIC_API_KEY, etc.) NO están aquí: viven en Supabase.
- `supabase/migrations/` — tablas. Solo está la de cursos reconstruida; el resto de migraciones sigue en Supabase.
- Pendiente de copiar aquí: funciones `desdelared-correo` y `desdelared-agenda`.
- Nota: pináculo, cristales, oráculo y whatsapp son copias de trabajo; la versión viva puede diferir ligeramente.

## Apps externos (fuera de este repo)
dones, dharma, runas, códigos, interior, maestros, cristales: `*.desdelared.net`. Falta confirmar si cada uno tiene su repositorio.
