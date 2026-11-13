import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { PreFooterContent } from '../../../../core/models/content.interface';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-pre-footer-admin',
  imports: [FormsModule, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Folleto PDF</h1>
        <p>Franja de descarga antes del pie de página. Sube aquí el PDF que se descargará con el botón “{{ form.pdfButtonText }}”.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head">
          <div><h2>Archivo PDF</h2><p>Máximo 25 MB. Al subirlo queda publicado y enlazado automáticamente al botón de descarga.</p></div>
        </header>

        <div class="pdf-box" [class.is-drag]="dragging()" (dragover)="$event.preventDefault(); dragging.set(true)"
          (dragleave)="dragging.set(false)" (drop)="onDrop($event)">
          <span class="pdf-box__icon"><app-icon name="file-pdf" [size]="34" [stroke]="1.5" /></span>
          <div class="pdf-box__info">
            <strong>{{ fileName() }}</strong>
            <small>{{ form.pdfUrl || 'Sin archivo asignado' }}</small>
          </div>
          <div class="pdf-box__actions">
            @if (form.pdfUrl) {
              <a class="btn btn--soft btn--sm" [href]="form.pdfUrl" target="_blank" rel="noopener"><app-icon name="eye" [size]="15" /> Ver actual</a>
            }
            <label class="btn btn--primary btn--sm" [class.is-busy]="uploading() || !content.canUpload()">
              <app-icon name="upload" [size]="15" /> {{ uploading() ? 'Subiendo…' : 'Subir nuevo PDF' }}
              <input type="file" accept="application/pdf,.pdf" (change)="onPick($event)" hidden>
            </label>
          </div>
          <p class="pdf-box__hint">También puedes arrastrar el archivo aquí.</p>
        </div>
      </section>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Textos</h2></div></header>
        <form (ngSubmit)="save()" class="adm-grid">
          <div class="field adm-span-2"><label for="pf-text">Texto de la franja</label>
            <input id="pf-text" class="input" [(ngModel)]="form.text" name="text" required></div>
          <div class="field"><label for="pf-btn">Texto del botón</label>
            <input id="pf-btn" class="input" [(ngModel)]="form.pdfButtonText" name="pdfButtonText" required></div>
          <div class="field"><label for="pf-url">Ruta del PDF</label>
            <input id="pf-url" class="input" [(ngModel)]="form.pdfUrl" name="pdfUrl" placeholder="pdf/folleto.pdf" required>
            <small>Se completa sola al subir un archivo.</small></div>
          <div class="adm-actions adm-span-2">
            <button type="submit" class="btn btn--primary"><app-icon name="save" [size]="16" /> Guardar cambios</button>
          </div>
        </form>
      </section>
    </div>
  `,
  styles: `
    .pdf-box {
      display: flex; flex-wrap: wrap; align-items: center; gap: 16px 20px;
      padding: 22px; border-radius: var(--radius-sm);
      border: 1px dashed rgba(242,103,35,.5); background: rgba(242,103,35,.05);
      transition: background .2s, box-shadow .2s;
    }
    .pdf-box.is-drag { background: rgba(242,103,35,.14); box-shadow: var(--glow-orange); }
    .pdf-box__icon { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 16px; color: var(--orange-neon); border: 1px solid rgba(242,103,35,.5); background: rgba(5,7,15,.6); }
    .pdf-box__info { flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; }
    .pdf-box__info strong { font-size: 1.6rem; color: #fff; word-break: break-all; }
    .pdf-box__info small { color: var(--muted); font-size: 1.3rem; word-break: break-all; }
    .pdf-box__actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .pdf-box__actions label { cursor: pointer; }
    .pdf-box__actions .is-busy { opacity: .6; pointer-events: none; }
    .pdf-box__hint { width: 100%; font-size: 1.3rem; color: var(--muted); }
    code { padding: 1px 6px; border-radius: 6px; background: rgba(5,7,15,.7); border: 1px solid var(--border); font-size: 1.25rem; color: #ffc38f; }
  `
})
export class PreFooterAdmin {
  content = inject(ContentService);
  form: PreFooterContent = { ...this.content.preFooter() };
  uploading = signal(false);
  dragging = signal(false);

  fileName() {
    return this.form.pdfUrl ? this.form.pdfUrl.split('/').pop() : 'Ningún PDF';
  }

  onPick(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) this.upload(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.upload(file);
  }

  private upload(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.content.notify('El archivo debe ser un PDF', 'error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      this.content.notify('El PDF supera los 25 MB', 'error');
      return;
    }
    this.uploading.set(true);
    this.content.uploadFile(file, 'pdf').subscribe({
      next: path => {
        this.uploading.set(false);
        this.form = { ...this.form, pdfUrl: path };
        this.content.updatePreFooter({ ...this.form });
      },
      error: err => {
        this.uploading.set(false);
        this.content.notify(err?.error?.message || 'No se pudo subir el PDF. ¿Está corriendo el servidor local (node server.js)?', 'error');
      }
    });
  }

  save() {
    this.content.updatePreFooter({ ...this.form });
  }
}
