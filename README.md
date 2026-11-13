# Seguridad Delfos Ltda · Sitio web

Sitio en Angular 21 publicado en **https://seguridaddelfos.com** (Cloudflare Pages + Cloudflare Access para `/admin`).

## Desarrollo

```bash
npm install
npm run dev      # página (http://localhost:4200) + servidor local de guardado (http://localhost:3000)
npm run build    # compila en dist/delfos-angular/browser
npm test
```

El contenido del sitio vive en `src/assets/data.json` y se incluye en la compilación (la página se pinta sin parpadeos).

## Panel administrador (`/admin`)

El panel guarda los cambios en un lugar distinto según dónde se use:

| Dónde | Qué pasa al guardar |
| --- | --- |
| Local (`npm run dev`) | Se escribe `src/assets/data.json`; los archivos subidos van a `public/images` y `public/pdf`. La página se recarga sola. Luego se hace commit y push. |
| Sitio publicado | Se guarda en Cloudflare KV y se publica al instante (sin volver a desplegar). Los archivos subidos se sirven en `/media/...`. |

### Activar el guardado en el sitio publicado (una sola vez)

El código ya está listo (carpeta `functions/` = Cloudflare Pages Functions). Solo falta crear el almacenamiento:

1. En el panel de Cloudflare: **Storage & Databases → KV → Create namespace**, por ejemplo `delfos-contenido`.
2. En **Workers & Pages → (proyecto del sitio) → Settings → Bindings → Add → KV namespace**:
   nombre de la variable **`DELFOS_KV`**, namespace `delfos-contenido`. Hazlo para *Production* (y *Preview* si lo usas).
3. Vuelve a desplegar (un push a la rama principal o **Retry deployment**).
4. Entra a `https://seguridaddelfos.com/admin`: en la parte superior debe decir *“Sitio publicado · los cambios se publican al guardar”*.

Seguridad: las escrituras (`/admin/api/*`) verifican la firma del token de **Cloudflare Access** (equipo
`dincordevelopers`). Si cambias la aplicación de Access, configura las variables de entorno `ACCESS_TEAM_DOMAIN`
y `ACCESS_AUD` (Application Audience Tag) en el proyecto de Pages.

### Importante: contenido del panel vs. código

Cuando se guarda desde el panel publicado, ese contenido tiene prioridad sobre `src/assets/data.json`.
Antes de editar textos en el código, descarga el contenido actual desde **Resumen → Descargar contenido (data.json)**
y reemplaza `src/assets/data.json`. El botón **Restablecer al contenido del código** borra lo guardado en el panel
(queda un respaldo en la clave `content:previous` del KV).

## PQRS

La sección PQRS arma la solicitud (con número de radicado) y la abre en el correo del visitante
(aplicación de correo, Gmail u Outlook/Hotmail) con el asunto `PQRS WEB DELFOS - <asunto>`.
El correo de destino se cambia en **Admin → PQRS**.
