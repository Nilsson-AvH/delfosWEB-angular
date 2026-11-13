import { Ctx, MEDIA_PREFIX } from '../../cloudflare/lib';

/** GET /media/<folder>/<archivo> — sirve los archivos subidos desde el panel (PDF e imágenes). */
export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const kv = ctx.env.DELFOS_KV;
  const parts = Array.isArray(ctx.params['path']) ? ctx.params['path'] : [ctx.params['path']];
  const path = parts.filter(Boolean).join('/');
  if (!kv || !path || path.includes('..')) return new Response('No encontrado', { status: 404 });

  const { value, metadata } = await kv.getWithMetadata<{ contentType?: string; uploadedAt?: string }>(MEDIA_PREFIX + path, 'arrayBuffer');
  if (!value) return new Response('No encontrado', { status: 404 });

  const etag = `"${metadata?.uploadedAt || ''}"`;
  if (ctx.request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: { etag } });

  const name = path.split('/').pop() || 'archivo';
  return new Response(value, {
    headers: {
      'content-type': metadata?.contentType || 'application/octet-stream',
      'cache-control': 'public, max-age=300',
      'content-disposition': `inline; filename="${name}"`,
      'x-content-type-options': 'nosniff',
      etag,
    },
  });
};
