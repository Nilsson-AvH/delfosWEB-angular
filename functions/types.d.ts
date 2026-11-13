// Declaración mínima de HTMLRewriter (disponible en el runtime de Cloudflare)
declare class HTMLRewriter {
  on(selector: string, handlers: { element?(el: { append(content: string, opts?: { html?: boolean }): void }): void }): HTMLRewriter;
  transform(res: Response): Response;
}
