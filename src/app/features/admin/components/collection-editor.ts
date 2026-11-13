import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { Icon, SERVICE_ICON_OPTIONS, normalizeIconName } from '../../../shared/components/icon/icon';
import { Modal } from '../../../shared/components/modal/modal';

export type FieldType = 'text' | 'textarea' | 'number' | 'image' | 'url' | 'select' | 'icon';

export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  hint?: string;
  placeholder?: string;
  /** Ocupa las dos columnas del formulario */
  full?: boolean;
  required?: boolean;
}

export interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'image' | 'icon' | 'badge';
}

type Item = Record<string, any>;

/**
 * Editor genérico de listas del panel: tabla ordenada + ventana modal con el formulario.
 * Se usa en carrusel, servicios, galería, testimonios, noticias, enlaces, etc.
 */
@Component({
  selector: 'app-collection-editor',
  imports: [FormsModule, Icon, Modal],
  template: `
    <section class="adm-card">
      <header class="adm-card__head">
        <div>
          <h2>{{ heading() }}</h2>
          @if (description()) { <p>{{ description() }}</p> }
        </div>
        @if (allowAdd()) {
          <button type="button" class="btn btn--primary btn--sm" (click)="startNew()">
            <app-icon name="plus" [size]="16" /> Agregar {{ itemName() }}
          </button>
        }
      </header>

      @if (items().length === 0) {
        <p class="adm-empty">Aún no hay elementos. Usa “Agregar {{ itemName() }}”.</p>
      } @else {
        <div class="adm-table-wrap">
          <table class="adm-table">
            <thead>
              <tr>
                <th class="adm-table__num">#</th>
                @for (col of columns(); track col.key) { <th>{{ col.label }}</th> }
                <th class="adm-table__actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (item of items(); track item['id'] ?? $index; let i = $index) {
                <tr>
                  <td class="adm-table__num">{{ i + 1 }}</td>
                  @for (col of columns(); track col.key) {
                    <td [attr.data-label]="col.label">
                      @switch (col.type) {
                        @case ('image') {
                          @if (item[col.key]) { <img class="adm-thumb" [src]="item[col.key]" alt="" loading="lazy"> }
                        }
                        @case ('icon') { <span class="adm-icon-cell"><app-icon [name]="item[col.key]" [size]="22" /></span> }
                        @case ('badge') { <span class="adm-badge" [attr.data-type]="item[col.key]">{{ badgeLabel(item[col.key]) }}</span> }
                        @default { <span class="adm-clip">{{ item[col.key] }}</span> }
                      }
                    </td>
                  }
                  <td class="adm-table__actions">
                    <div class="adm-row-actions">
                      <button type="button" class="btn btn--soft btn--sm" (click)="edit(item)" [attr.aria-label]="'Editar ' + itemName()">
                        <app-icon name="edit" [size]="15" /> Editar
                      </button>
                      @if (allowDelete()) {
                        <button type="button" class="btn btn--danger btn--sm" (click)="askDelete(item)" [attr.aria-label]="'Eliminar ' + itemName()">
                          <app-icon name="trash" [size]="15" />
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    @if (current(); as model) {
      <app-modal size="wide" [label]="(model['id'] ? 'Editar ' : 'Nuevo ') + itemName()" (closed)="cancel()">
        <form class="adm-form" (ngSubmit)="submit()" #f="ngForm">
          <h3 class="adm-form__title">{{ model['id'] ? 'Editar' : 'Agregar' }} {{ itemName() }}</h3>
          <div class="adm-grid">
            @for (field of fields(); track field.key) {
              <div class="field" [class.adm-span-2]="field.full || field.type === 'textarea' || field.type === 'image'">
                <label [for]="'f-' + field.key">{{ field.label }}@if (field.required) { <b class="adm-req">*</b> }</label>
                @switch (field.type) {
                  @case ('textarea') {
                    <textarea class="input" [id]="'f-' + field.key" [name]="field.key" rows="5" [(ngModel)]="model[field.key]"
                      [required]="!!field.required" [placeholder]="field.placeholder || ''"></textarea>
                  }
                  @case ('number') {
                    <input class="input" type="number" [id]="'f-' + field.key" [name]="field.key" [(ngModel)]="model[field.key]" [required]="!!field.required">
                  }
                  @case ('select') {
                    <select class="input" [id]="'f-' + field.key" [name]="field.key" [(ngModel)]="model[field.key]">
                      @for (opt of field.options; track opt.value) { <option [value]="opt.value">{{ opt.label }}</option> }
                    </select>
                  }
                  @case ('icon') {
                    <div class="adm-icon-picker">
                      @for (opt of iconOptions; track opt.value) {
                        <button type="button" class="adm-icon-opt" [class.is-active]="iconKey(model[field.key]) === opt.value"
                          (click)="model[field.key] = opt.value" [title]="opt.label" [attr.aria-label]="opt.label">
                          <app-icon [name]="opt.value" [size]="22" />
                        </button>
                      }
                    </div>
                  }
                  @case ('image') {
                    <div class="adm-image-field">
                      <div class="adm-image-field__preview">
                        @if (previews()[field.key] || model[field.key]) { <img [src]="previews()[field.key] || model[field.key]" alt="Vista previa"> }
                        @else { <app-icon name="image" [size]="28" /> }
                      </div>
                      <div class="adm-image-field__controls">
                        <input class="input" type="text" [id]="'f-' + field.key" [name]="field.key" [(ngModel)]="model[field.key]"
                          placeholder="images/mi-imagen.webp" [required]="!!field.required">
                        <label class="btn btn--ghost btn--sm adm-upload" [class.is-busy]="uploading() === field.key || !content.canUpload()"
                          [title]="content.canUpload() ? 'Subir imagen' : 'Subida no disponible: el almacenamiento no está configurado'">
                          <app-icon name="upload" [size]="15" />
                          {{ uploading() === field.key ? 'Subiendo…' : 'Subir imagen' }}
                          <input type="file" accept="image/webp,image/jpeg,image/png,image/avif,image/svg+xml" (change)="upload($event, field.key)" hidden>
                        </label>
                      </div>
                    </div>
                  }
                  @default {
                    <input class="input" type="text" [id]="'f-' + field.key" [name]="field.key"
                      [(ngModel)]="model[field.key]" [required]="!!field.required" [placeholder]="field.placeholder || ''">
                  }
                }
                @if (field.hint) { <small>{{ field.hint }}</small> }
              </div>
            }
          </div>
          <div class="adm-form__actions">
            <button type="button" class="btn btn--soft" (click)="cancel()">Cancelar</button>
            <button type="submit" class="btn btn--primary" [disabled]="f.invalid">
              <app-icon name="save" [size]="16" /> Guardar
            </button>
          </div>
        </form>
      </app-modal>
    }

    @if (pendingDelete(); as del) {
      <app-modal label="Confirmar eliminación" (closed)="pendingDelete.set(null)">
        <div class="adm-form">
          <h3 class="adm-form__title">¿Eliminar {{ itemName() }}?</h3>
          <p class="muted">Se eliminará “{{ del['title'] || del['text'] || del['label'] || del['alt'] || del['authorName'] || 'este elemento' }}”. Esta acción no se puede deshacer.</p>
          <div class="adm-form__actions">
            <button type="button" class="btn btn--soft" (click)="pendingDelete.set(null)">Cancelar</button>
            <button type="button" class="btn btn--danger" (click)="confirmDelete()"><app-icon name="trash" [size]="15" /> Eliminar</button>
          </div>
        </div>
      </app-modal>
    }
  `,
})
export class CollectionEditor {
  content = inject(ContentService);

  heading = input.required<string>();
  description = input<string>('');
  itemName = input<string>('elemento');
  items = input.required<Item[]>();
  fields = input.required<FieldDef[]>();
  columns = input.required<ColumnDef[]>();
  allowAdd = input(true);
  allowDelete = input(true);
  blank = input<Item>({});

  saved = output<Item>();
  removed = output<string>();

  current = signal<Item | null>(null);
  pendingDelete = signal<Item | null>(null);
  uploading = signal<string | null>(null);
  /** Vista previa local de las imágenes recién subidas (aún no publicadas por el servidor de desarrollo) */
  previews = signal<Record<string, string>>({});
  iconOptions = SERVICE_ICON_OPTIONS;

  iconKey(v: string) { return normalizeIconName(v); }

  badgeLabel(v: string) {
    return ({ internal: 'Sección', route: 'Ruta', external: 'Externo' } as Record<string, string>)[v] ?? v;
  }

  startNew() { this.previews.set({}); this.current.set(structuredClone(this.blank())); }
  edit(item: Item) { this.previews.set({}); this.current.set(structuredClone(item)); }
  cancel() { this.current.set(null); }

  submit() {
    const model = this.current();
    if (!model) return;
    for (const f of this.fields()) {
      if (f.type === 'number') model[f.key] = Number(model[f.key]) || 0;
      if (typeof model[f.key] === 'string') model[f.key] = model[f.key].trim();
    }
    if (!model['id']) model['id'] = Date.now().toString();
    this.saved.emit(model);
    this.current.set(null);
  }

  askDelete(item: Item) { this.pendingDelete.set(item); }

  confirmDelete() {
    const item = this.pendingDelete();
    if (item?.['id']) this.removed.emit(item['id']);
    this.pendingDelete.set(null);
  }

  upload(event: Event, key: string) {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;
    this.uploading.set(key);
    this.content.uploadFile(file, 'images').subscribe({
      next: path => {
        const model = this.current();
        if (model) this.current.set({ ...model, [key]: path });
        this.previews.update(p => ({ ...p, [key]: URL.createObjectURL(file) }));
        this.uploading.set(null);
        this.content.notify('Imagen subida correctamente');
      },
      error: err => {
        this.uploading.set(null);
        this.content.notify(err?.error?.message || 'No se pudo subir la imagen. ¿Está corriendo el servidor local?', 'error');
      }
    });
  }
}
