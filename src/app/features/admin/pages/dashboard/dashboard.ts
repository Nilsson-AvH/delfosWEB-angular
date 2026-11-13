import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../../core/services/content.service';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Resumen</h1>
        <p>Administra el contenido de la página. Cada sección del menú lateral corresponde a una parte del sitio.</p>
      </header>

      <div class="dash-grid">
        @for (s of stats(); track s.label) {
          <a class="dash-stat adm-card" [routerLink]="s.link">
            <span class="dash-stat__icon"><app-icon [name]="s.icon" [size]="22" /></span>
            <span class="dash-stat__num">{{ s.value }}</span>
            <span class="dash-stat__label">{{ s.label }}</span>
          </a>
        }
      </div>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Cómo se guardan los cambios</h2></div></header>
        @switch (c.storageMode()) {
          @case ('cloud') {
            <p class="dash-p">Estás en el <strong>sitio publicado</strong>. Al pulsar “Guardar” en cualquier sección, el cambio se publica de inmediato
              (no hace falta volver a desplegar). Las imágenes y el PDF que subas quedan alojados en el propio sitio.</p>
            <p class="dash-p muted">Importante: lo editado aquí tiene prioridad sobre el archivo <code>src/assets/data.json</code> del código.
              Si un desarrollador va a editar textos en el código, primero descarga el contenido actual y reemplaza ese archivo.</p>
          }
          @case ('local') {
            <ol class="dash-steps">
              <li>Estás en <strong>modo local</strong> (<code>npm run dev</code>): los cambios se guardan en <code>src/assets/data.json</code> y los archivos en <code>public/</code>.</li>
              <li>Para publicarlos, haz commit y push: Cloudflare Pages vuelve a desplegar el sitio.</li>
            </ol>
          }
          @default {
            <p class="dash-p">El sitio publicado <strong>no tiene almacenamiento configurado</strong>, así que los cambios no se guardarán.
              Sigue los pasos de la sección “Panel administrador en producción” del archivo README.md (crear un espacio KV en Cloudflare y vincularlo como <code>DELFOS_KV</code>).</p>
          }
        }
        <div class="adm-actions">
          <button type="button" class="btn btn--soft btn--sm" (click)="c.exportJson()"><app-icon name="download" [size]="15" /> Descargar contenido (data.json)</button>
          @if (c.storageMode() === 'cloud') {
            <button type="button" class="btn btn--danger btn--sm" (click)="confirmReset.set(true)"><app-icon name="trash" [size]="15" /> Restablecer al contenido del código</button>
          }
        </div>
        @if (confirmReset()) {
          <div class="dash-confirm">
            <p>Se borrarán todos los cambios hechos desde este panel y el sitio volverá a mostrar el contenido de <code>data.json</code> del código. Los archivos subidos no se eliminan. ¿Continuar?</p>
            <div class="adm-actions">
              <button type="button" class="btn btn--soft btn--sm" (click)="confirmReset.set(false)">Cancelar</button>
              <button type="button" class="btn btn--danger btn--sm" (click)="reset()">Sí, restablecer</button>
            </div>
          </div>
        }
      </section>
    </div>
  `,
  styles: `
    .dash-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); }
    .dash-stat { display: flex; flex-direction: column; gap: 6px; transition: border-color .25s, box-shadow .25s, transform .25s; }
    .dash-stat:hover { border-color: var(--border-strong); box-shadow: var(--glow-orange); transform: translateY(-3px); }
    .dash-stat__icon { color: var(--orange-neon); }
    .dash-stat__num { font-family: var(--font-display); font-size: 4rem; line-height: 1; color: #fff; }
    .dash-stat__label { font-size: 1.3rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
    .dash-steps { margin: 0; padding-left: 22px; display: grid; gap: 10px; color: #cfd5e8; font-size: 1.5rem; }
    .dash-p { font-size: 1.5rem; color: #cfd5e8; }
    .dash-p + .dash-p { margin-top: 10px; font-size: 1.4rem; }
    .dash-confirm { margin-top: 16px; padding: 14px 16px; border-radius: 10px; border: 1px solid rgba(209,36,32,.5); background: rgba(209,36,32,.08); font-size: 1.45rem; }
    code { padding: 2px 6px; border-radius: 6px; background: rgba(5,7,15,.7); border: 1px solid var(--border); font-size: 1.3rem; color: #ffc38f; }
  `
})
export class Dashboard {
  c = inject(ContentService);
  confirmReset = signal(false);

  reset() {
    this.c.resetCloudContent().subscribe({
      next: () => location.reload(),
      error: () => this.c.notify('No se pudo restablecer el contenido', 'error'),
    });
  }

  stats = computed(() => [
    { label: 'Diapositivas', value: this.c.slides().length, icon: 'images', link: '../carousel' },
    { label: 'Servicios', value: this.c.services().length, icon: 'shield-check', link: '../services' },
    { label: 'Indicadores', value: this.c.indicators().length, icon: 'chart', link: '../indicators' },
    { label: 'Fotos galería', value: this.c.galleryItems().length, icon: 'image', link: '../gallery' },
    { label: 'Testimonios', value: this.c.testimonials().length, icon: 'quote', link: '../testimonials' },
    { label: 'Noticias', value: this.c.newsItems().length, icon: 'news', link: '../news' },
  ]);
}
