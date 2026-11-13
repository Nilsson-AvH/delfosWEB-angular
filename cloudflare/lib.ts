/**
 * Utilidades compartidas por las Cloudflare Pages Functions (carpeta /functions).
 * Se ejecutan en Cloudflare, no en el navegador ni en Angular.
 */

/* Tipos mínimos del runtime de Cloudflare (evita depender de @cloudflare/workers-types) */
export interface KV {
  get(key: string, type: 'text'): Promise<string | null>;
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  getWithMetadata<M>(key: string, type: 'arrayBuffer'): Promise<{ value: ArrayBuffer | null; metadata: M | null }>;
  put(key: string, value: string | ArrayBuffer, options?: { metadata?: unknown }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Env {
  /** Espacio KV de Cloudflare donde se guarda el contenido y los archivos subidos */
  DELFOS_KV?: KV;
  /** Dominio del equipo de Cloudflare Zero Trust (Access) */
  ACCESS_TEAM_DOMAIN?: string;
  /** "Application Audience (AUD) Tag" de la aplicación de Access que protege /admin */
  ACCESS_AUD?: string;
  /** Solo para pruebas locales con `wrangler pages dev` (se ignora fuera de localhost) */
  ACCESS_DEV_BYPASS?: string;
}

export interface Ctx {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  next: () => Promise<Response>;
}

// Valores de la aplicación de Access actual de seguridaddelfos.com (no son secretos: son públicos en la redirección de login).
const DEFAULT_TEAM = 'dincordevelopers.cloudflareaccess.com';
const DEFAULT_AUD = '9ef022d199f1c23248d1a6d318f7853c9c34dbe1688b1b47652f0a2f50607594';

export const CONTENT_KEY = 'content';
export const CONTENT_BACKUP_KEY = 'content:previous';
export const MEDIA_PREFIX = 'media:';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function getToken(request: Request): string | null {
  const header = request.headers.get('cf-access-jwt-assertion');
  if (header) return header;
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return m ? m[1] : null;
}

let certsCache: { at: number; keys: (JsonWebKey & { kid?: string })[] } | null = null;

async function getCerts(team: string) {
  if (certsCache && Date.now() - certsCache.at < 10 * 60 * 1000) return certsCache.keys;
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error('No se pudieron obtener los certificados de Access');
  const body = (await res.json()) as { keys: (JsonWebKey & { kid?: string })[] };
  certsCache = { at: Date.now(), keys: body.keys };
  return body.keys;
}

/**
 * Verifica que la petición venga de un usuario autenticado por Cloudflare Access
 * (firma RS256 del JWT, audiencia, emisor y expiración). Devuelve el correo o null.
 */
export async function verifyAccess(request: Request, env: Env): Promise<{ email: string } | null> {
  const host = new URL(request.url).hostname;
  if (env.ACCESS_DEV_BYPASS === 'true' && (host === 'localhost' || host === '127.0.0.1')) {
    return { email: 'pruebas@localhost' };
  }

  const token = getToken(request);
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const team = env.ACCESS_TEAM_DOMAIN || DEFAULT_TEAM;
    const aud = env.ACCESS_AUD || DEFAULT_AUD;
    const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));

    if (header.alg !== 'RS256') return null;
    const jwk = (await getCerts(team)).find(k => k.kid === header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (!ok) return null;

    const now = Math.floor(Date.now() / 1000);
    const auds: string[] = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(aud)) return null;
    if (payload.iss !== `https://${team}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return null;

    return { email: payload.email || 'administrador' };
  } catch {
    return null;
  }
}

/** Respuesta estándar cuando falta la sesión de Access o el almacenamiento KV. */
export async function guard(ctx: Ctx): Promise<Response | { kv: KV; email: string }> {
  const user = await verifyAccess(ctx.request, ctx.env);
  if (!user) return json({ ok: false, message: 'Sesión no válida o expirada. Vuelve a ingresar al panel.' }, 401);
  if (!ctx.env.DELFOS_KV) {
    return json({ ok: false, message: 'Almacenamiento no configurado: vincula un espacio KV llamado DELFOS_KV al proyecto de Pages.' }, 503);
  }
  return { kv: ctx.env.DELFOS_KV, email: user.email };
}
