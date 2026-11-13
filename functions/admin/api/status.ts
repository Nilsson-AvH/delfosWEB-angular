import { Ctx, json, verifyAccess } from '../../../cloudflare/lib';

/** GET /admin/api/status — el panel lo usa para saber si puede guardar en producción. */
export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const user = await verifyAccess(ctx.request, ctx.env);
  if (!user) return json({ ok: false, storage: false, message: 'Sesión no válida' }, 401);
  return json({ ok: true, storage: !!ctx.env.DELFOS_KV, email: user.email });
};
