import { CONTENT_BACKUP_KEY, CONTENT_KEY, Ctx, guard, json } from '../../../cloudflare/lib';

const ALLOWED_KEYS = new Set([
  'slides', 'aboutUsTitle', 'aboutUsItems', 'servicesTitle', 'servicesSubtitle', 'services', 'indicatorsTitle', 'indicators',
  'galleryTitle', 'gallerySubtitle', 'galleryItems', 'testimonialsTitle', 'testimonialsSubtitle', 'testimonials', 'newsTitle',
  'newsSubtitle', 'newsItems', 'preFooter', 'contactNumber', 'utilsTitle', 'utilsLinks', 'headerLinks', 'footerAbout',
  'footerMainLinks', 'socialLinks', 'pqrs',
]);
const MAX_BYTES = 1024 * 1024; // 1 MB de texto es mucho más que suficiente

/** GET /admin/api/content — contenido publicado desde el panel (o null si se usa el del código). */
export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const g = await guard(ctx);
  if (g instanceof Response) return g;
  const raw = await g.kv.get(CONTENT_KEY, 'text');
  return json({ ok: true, content: raw ? JSON.parse(raw) : null });
};

/** PUT /admin/api/content — guarda y publica el contenido completo del sitio. */
export const onRequestPut = async (ctx: Ctx): Promise<Response> => {
  const g = await guard(ctx);
  if (g instanceof Response) return g;

  const text = await ctx.request.text();
  if (text.length > MAX_BYTES) return json({ ok: false, message: 'El contenido es demasiado grande' }, 413);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch {
    return json({ ok: false, message: 'JSON inválido' }, 400);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ ok: false, message: 'Formato inválido' }, 400);
  const unknown = Object.keys(data).filter(k => !ALLOWED_KEYS.has(k));
  if (unknown.length) return json({ ok: false, message: `Campos no permitidos: ${unknown.join(', ')}` }, 400);
  if (!Array.isArray(data['slides'])) return json({ ok: false, message: 'Faltan las diapositivas' }, 400);

  const previous = await g.kv.get(CONTENT_KEY, 'text');
  if (previous) await g.kv.put(CONTENT_BACKUP_KEY, previous);
  await g.kv.put(CONTENT_KEY, JSON.stringify(data), { metadata: { updatedAt: new Date().toISOString(), by: g.email } });
  return json({ ok: true });
};

/** DELETE /admin/api/content — vuelve al contenido incluido en el código (src/assets/data.json). */
export const onRequestDelete = async (ctx: Ctx): Promise<Response> => {
  const g = await guard(ctx);
  if (g instanceof Response) return g;
  const previous = await g.kv.get(CONTENT_KEY, 'text');
  if (previous) await g.kv.put(CONTENT_BACKUP_KEY, previous);
  await g.kv.delete(CONTENT_KEY);
  return json({ ok: true });
};
