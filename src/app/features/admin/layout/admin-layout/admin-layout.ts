import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ContentService } from '../../../../core/services/content.service';
import { Icon } from '../../../../shared/components/icon/icon';

interface NavItem { path: string; label: string; icon: string; }

/**
 * Layout del panel administrador. Contiene además los estilos compartidos de todas las
 * vistas del panel (ViewEncapsulation.None, prefijo .adm-), que solo se cargan al entrar al admin.
 */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="adm" [class.adm--menu-open]="isSidebarOpen()">
      <aside class="adm-side">
        <a routerLink="/" class="adm-side__brand">
          <img src="images/logo-shield.webp" alt="" width="36" height="33">
          <span>Delfos <em>Admin</em></span>
        </a>
        <nav class="adm-side__nav" aria-label="Secciones del panel">
          @for (item of nav; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="is-active" (click)="isSidebarOpen.set(false)">
              <app-icon [name]="item.icon" [size]="18" /> <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="adm-side__foot">
          <a routerLink="/" class="btn btn--soft btn--sm btn--block"><app-icon name="external" [size]="15" /> Ver sitio</a>
          <button type="button" class="btn btn--danger btn--sm btn--block" (click)="logout()"><app-icon name="logout" [size]="15" /> Cerrar sesión</button>
        </div>
      </aside>

      <div class="adm-overlay" (click)="isSidebarOpen.set(false)"></div>

      <div class="adm-main">
        <header class="adm-top">
          <button type="button" class="btn btn--icon btn--sm adm-top__menu" (click)="isSidebarOpen.set(!isSidebarOpen())" aria-label="Abrir menú">
            <app-icon [name]="isSidebarOpen() ? 'x' : 'menu'" [size]="18" />
          </button>
          <span class="adm-mode" [attr.data-mode]="content.storageMode()">
            <i></i>
            @switch (content.storageMode()) {
              @case ('local') { Modo local · los cambios se guardan en data.json }
              @case ('cloud') { Sitio publicado · los cambios se publican al guardar }
              @case ('checking') { Verificando almacenamiento… }
              @default { Sin almacenamiento · los cambios no se guardarán }
            }
          </span>
          <span class="adm-top__user"><app-icon name="user" [size]="16" /> Administrador</span>
        </header>

        <main class="adm-content">
          <router-outlet />
        </main>
      </div>

      <div class="adm-toasts" aria-live="polite">
        @for (t of content.toasts(); track t.id) {
          <div class="adm-toast" [attr.data-kind]="t.kind">
            <app-icon [name]="t.kind === 'error' ? 'alert' : (t.kind === 'info' ? 'info' : 'check')" [size]="18" />
            <span>{{ t.text }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    /* ===================== Layout ===================== */
    .adm { display: flex; min-height: 100vh; min-height: 100dvh; background: var(--bg); }

    .adm-side {
      position: sticky; top: 0;
      display: flex; flex-direction: column;
      width: 250px; height: 100vh; height: 100dvh; flex-shrink: 0;
      padding: 18px 14px;
      background: linear-gradient(180deg, #0b1022, #070a16);
      border-right: 1px solid var(--border);
      overflow-y: auto;
    }
    .adm-side__brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px 18px; margin-bottom: 8px; border-bottom: 1px solid var(--border); }
    .adm-side__brand img { filter: drop-shadow(0 0 8px rgba(244,181,39,.4)); }
    .adm-side__brand span { font-family: var(--font-display); font-size: 2rem; letter-spacing: .06em; text-transform: uppercase; color: #fff; }
    .adm-side__brand em { font-style: normal; color: var(--orange-neon); }
    .adm-side__nav { display: grid; gap: 2px; flex: 1; }
    .adm-side__nav a {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 10px;
      font-size: 1.45rem; color: #b9c0d6;
      border: 1px solid transparent;
      transition: background .2s, color .2s, border-color .2s;
    }
    .adm-side__nav a:hover { background: rgba(255,255,255,.04); color: #fff; }
    .adm-side__nav a.is-active { color: #fff; background: rgba(242,103,35,.12); border-color: rgba(242,103,35,.4); box-shadow: inset 3px 0 0 var(--orange); }
    .adm-side__nav a.is-active app-icon { color: var(--orange-neon); }
    .adm-side__foot { display: grid; gap: 8px; padding-top: 16px; border-top: 1px solid var(--border); }

    .adm-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .adm-top {
      position: sticky; top: 0; z-index: 20;
      display: flex; align-items: center; gap: 14px;
      min-height: 60px; padding: 10px clamp(16px, 3vw, 32px);
      background: rgba(5,7,15,.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .adm-top__menu { display: none; }
    .adm-top__user { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 1.4rem; white-space: nowrap; }
    .adm-mode { display: inline-flex; align-items: center; gap: 8px; font-size: 1.3rem; color: #a7f3c3; }
    .adm-mode i { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 10px var(--green); flex-shrink: 0; }
    .adm-mode[data-mode="none"], .adm-mode[data-mode="checking"] { color: #ffd59a; }
    .adm-mode[data-mode="none"] i, .adm-mode[data-mode="checking"] i { background: var(--yellow); box-shadow: 0 0 10px var(--yellow); }

    .adm-content { flex: 1; width: 100%; max-width: 1200px; margin: 0 auto; padding: clamp(18px, 3vw, 36px) clamp(16px, 3vw, 32px) 60px; }
    .adm-overlay { display: none; }

    @media (max-width: 900px) {
      .adm-side { position: fixed; left: 0; top: 0; z-index: 60; transform: translateX(-100%); transition: transform .3s var(--ease); }
      .adm--menu-open .adm-side { transform: none; box-shadow: 20px 0 40px rgba(0,0,0,.5); }
      .adm-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.55); }
      .adm--menu-open .adm-overlay { display: block; }
      .adm-top__menu { display: inline-flex; }
      .adm-top__user span, .adm-top__user { display: none; }
    }

    /* ===================== Páginas ===================== */
    .adm-page { display: grid; gap: 24px; }
    .adm-page__head h1 { font-size: clamp(2.6rem, 3vw, 3.2rem); text-transform: uppercase; letter-spacing: .04em; }
    .adm-page__head p { margin-top: 6px; color: var(--muted); font-size: 1.5rem; max-width: 760px; }

    .adm-card {
      padding: clamp(18px, 2.5vw, 26px);
      border-radius: var(--radius);
      background: var(--surface);
      border: 1px solid var(--border);
    }
    .adm-card__head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 12px 20px; margin-bottom: 18px; }
    .adm-card__head h2 { font-size: 2rem; letter-spacing: .04em; text-transform: uppercase; }
    .adm-card__head p { margin-top: 4px; color: var(--muted); font-size: 1.4rem; }

    .adm-grid { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .adm-span-2 { grid-column: 1 / -1; }
    @media (max-width: 700px) { .adm-grid { grid-template-columns: 1fr; } }

    .adm-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .adm-req { color: var(--orange-neon); margin-left: 4px; }
    .adm-empty { padding: 24px; text-align: center; color: var(--muted); border: 1px dashed var(--border); border-radius: var(--radius-sm); }

    /* Tabla */
    .adm-table-wrap { overflow-x: auto; border-radius: var(--radius-sm); border: 1px solid var(--border); }
    .adm-table { width: 100%; border-collapse: collapse; font-size: 1.45rem; }
    .adm-table th {
      padding: 12px 14px; text-align: left; white-space: nowrap;
      font-size: 1.2rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase;
      color: var(--muted); background: rgba(5,7,15,.6); border-bottom: 1px solid var(--border);
    }
    .adm-table td { padding: 12px 14px; vertical-align: middle; border-bottom: 1px solid rgba(125,145,255,.08); color: #dfe4f3; }
    .adm-table tr:last-child td { border-bottom: 0; }
    .adm-table tbody tr:hover td { background: rgba(242,103,35,.04); }
    .adm-table__num { width: 44px; color: var(--muted) !important; }
    .adm-table__actions { width: 1%; white-space: nowrap; text-align: right !important; }
    .adm-row-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .adm-thumb { width: 84px; height: 52px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); }
    .adm-clip { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 460px; word-break: break-word; }
    .adm-icon-cell { display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; color: var(--orange-neon); background: rgba(242,103,35,.1); border: 1px solid rgba(242,103,35,.35); }
    .adm-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 1.2rem; border: 1px solid var(--border); color: #cfd5e8; white-space: nowrap; }
    .adm-badge[data-type="internal"] { color: #9fb2ff; border-color: rgba(77,107,255,.5); }
    .adm-badge[data-type="route"] { color: #a7f3c3; border-color: rgba(34,197,94,.45); }
    .adm-badge[data-type="external"] { color: #ffc38f; border-color: rgba(242,103,35,.5); }

    /* Tabla → tarjetas en móvil (sin superposiciones) */
    @media (max-width: 700px) {
      .adm-table thead { display: none; }
      .adm-table, .adm-table tbody, .adm-table tr, .adm-table td { display: block; width: 100%; }
      .adm-table tr { padding: 12px; border-bottom: 1px solid var(--border); }
      .adm-table td { padding: 6px 0; border: 0; }
      .adm-table td[data-label]::before { content: attr(data-label); display: block; font-size: 1.1rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
      .adm-table__num { display: none !important; }
      .adm-table__actions { text-align: left !important; padding-top: 10px !important; }
      .adm-row-actions { justify-content: flex-start; }
    }

    /* Formulario en modal */
    .adm-form { padding: 26px clamp(18px, 3vw, 30px) 24px; }
    .adm-form__title { font-size: 2.2rem; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 20px; padding-right: 44px; }
    .adm-form__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border); }
    .adm-form p.muted { font-size: 1.5rem; }

    .adm-image-field { display: flex; gap: 14px; align-items: stretch; }
    .adm-image-field__preview {
      flex: 0 0 130px; height: 88px; display: grid; place-items: center; overflow: hidden;
      border-radius: 10px; border: 1px dashed var(--border); color: var(--muted); background: rgba(5,7,15,.5);
    }
    .adm-image-field__preview img { width: 100%; height: 100%; object-fit: cover; }
    .adm-image-field__controls { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
    .adm-upload { cursor: pointer; }
    .adm-upload.is-busy { opacity: .6; pointer-events: none; }
    @media (max-width: 520px) { .adm-image-field { flex-direction: column; } .adm-image-field__preview { flex-basis: auto; height: 140px; } }

    .adm-icon-picker { display: flex; flex-wrap: wrap; gap: 8px; }
    .adm-icon-opt {
      display: grid; place-items: center; width: 46px; height: 46px; padding: 0; cursor: pointer;
      border-radius: 12px; border: 1px solid var(--border); background: rgba(5,7,15,.5); color: #cfd5e8;
      transition: border-color .2s, color .2s, box-shadow .2s;
    }
    .adm-icon-opt:hover { border-color: rgba(242,103,35,.6); color: #fff; }
    .adm-icon-opt.is-active { border-color: var(--orange); color: var(--orange-neon); box-shadow: var(--glow-orange); }

    /* Notificaciones */
    .adm-toasts { position: fixed; right: 18px; bottom: 18px; z-index: 2000; display: grid; gap: 10px; max-width: min(420px, calc(100vw - 36px)); }
    .adm-toast {
      display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 12px;
      font-size: 1.45rem; color: #fff; background: rgba(12,16,34,.97);
      border: 1px solid rgba(34,197,94,.5); box-shadow: var(--shadow), 0 0 18px rgba(34,197,94,.2);
      animation: pop-in .25s var(--ease) both;
    }
    .adm-toast app-icon { color: var(--green); margin-top: 2px; }
    .adm-toast[data-kind="error"] { border-color: rgba(209,36,32,.6); box-shadow: var(--shadow), 0 0 18px rgba(209,36,32,.25); }
    .adm-toast[data-kind="error"] app-icon { color: #ff8582; }
    .adm-toast[data-kind="info"] { border-color: rgba(244,181,39,.55); }
    .adm-toast[data-kind="info"] app-icon { color: var(--yellow); }
  `
})
export class AdminLayout implements OnInit {
  content = inject(ContentService);

  ngOnInit() { this.content.detectStorage(); }
  private auth = inject(AuthService);
  isSidebarOpen = signal(false);

  nav: NavItem[] = [
    { path: './dashboard', label: 'Resumen', icon: 'dashboard' },
    { path: './header', label: 'Encabezado', icon: 'layout' },
    { path: './carousel', label: 'Carrusel', icon: 'images' },
    { path: './about', label: 'Nosotros', icon: 'info' },
    { path: './services', label: 'Servicios', icon: 'shield-check' },
    { path: './indicators', label: 'Indicadores', icon: 'chart' },
    { path: './gallery', label: 'Galería', icon: 'image' },
    { path: './testimonials', label: 'Testimonios', icon: 'quote' },
    { path: './news', label: 'Noticias', icon: 'news' },
    { path: './pqrs', label: 'PQRS', icon: 'message' },
    { path: './pre-footer', label: 'Folleto PDF', icon: 'file-pdf' },
    { path: './footer', label: 'Pie de página', icon: 'sliders' },
  ];

  logout() { this.auth.logout(); }
}
