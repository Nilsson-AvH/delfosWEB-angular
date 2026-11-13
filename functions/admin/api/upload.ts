import { Ctx, MEDIA_PREFIX, guard, json } from '../../../cloudflare/lib';

const RULES: Record<string, { types: Record<string, string>; maxMb: number }> = {
  pdf: { types: { '.pdf': 'application/pdf' }, maxMb: 25 },
  images: {
    types: { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.avif': 'image/avif' },
    maxMb: 10,
  },
};

/**
 * POST /admin/api/upload?folder=pdf|images&name=archivo.pdf  (cuerpo: el archivo en binario)
 * Guarda el archivo en KV y devuelve su ruta pública: media/<folder>/<archivo>
 */
export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const g = await guard(ctx);
  if (g instanceof Response) return g;

  const url = new URL(ctx.request.url);
  const folder = url.searchParams.get('folder') || '';
  const rule = RULES[folder];
  if (!rule) return json({ success: false, message: 'Carpeta no permitida' }, 400);

  const original = (url.searchParams.get('name') || 'archivo').split(/[\\/]/).pop() || 'archivo';
  const dot = original.lastIndexOf('.');
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : '';
  const contentType = rule.types[ext];
  if (!contentType) return json({ success: false, message: `Tipo de archivo no permitido (${ext || 'sin extensión'})` }, 400);

  const body = await ctx.request.arrayBuffer();
  if (body.byteLength === 0) return json({ success: false, message: 'Archivo vacío' }, 400);
  if (body.byteLength > rule.maxMb * 1024 * 1024) return json({ success: false, message: `El archivo supera ${rule.maxMb} MB` }, 413);
  if (folder === 'pdf' && new TextDecoder().decode(body.slice(0, 4)) !== '%PDF') {
    return json({ success: false, message: 'El archivo no es un PDF válido' }, 400);
  }

  const base = (dot >= 0 ? original.slice(0, dot) : original)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'archivo';
  const path = `${folder}/${base}${ext}`;

  await g.kv.put(MEDIA_PREFIX + path, body, {
    metadata: { contentType, size: body.byteLength, uploadedAt: new Date().toISOString(), by: g.email },
  });
  return json({ success: true, path: `media/${path}` });
};
