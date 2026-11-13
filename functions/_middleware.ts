import { CONTENT_KEY, Ctx } from '../cloudflare/lib';

/**
 * Inyecta en cada página HTML el contenido guardado desde el panel administrador,
 * para que el sitio se muestre actualizado al instante (sin redespliegue ni parpadeos).
 */
export const onRequest = async (ctx: Ctx): Promise<Response> => {
  const res = await ctx.next();
  const kv = ctx.env.DELFOS_KV;
  if (!kv || ctx.request.method !== 'GET') return res;
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;

  const raw = await kv.get(CONTENT_KEY, 'text');
  if (!raw) return res;

  let safe: string;
  try {
    // Re-serializa (valida el JSON) y escapa "<" para que no pueda cerrar la etiqueta <script>
    safe = JSON.stringify(JSON.parse(raw)).replace(/</g, '\\u003c');
  } catch {
    return res;
  }

  const rewritten = new HTMLRewriter()
    .on('head', {
      element(el) {
        el.append(`<script id="delfos-content" type="application/json">${safe}</script>`, { html: true });
      },
    })
    .transform(res);

  const out = new Response(rewritten.body, rewritten);
  out.headers.set('cache-control', 'no-cache');
  return out;
};
