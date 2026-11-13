import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { GalleryItem } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-gallery-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Galería</h1>
        <p>Fotos de la galería. Usa una descripción clara en cada imagen: ayuda al posicionamiento en Google.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Encabezado de la sección</h2></div></header>
        <div class="adm-grid">
          <div class="field"><label for="h-sub">Subtítulo (texto pequeño)</label><input id="h-sub" class="input" [(ngModel)]="subtitle" name="sub"></div>
          <div class="field"><label for="h-title">Título</label><input id="h-title" class="input" [(ngModel)]="title" name="title"></div>
        </div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="saveHeader()"><app-icon name="save" [size]="15" /> Guardar encabezado</button>
        </div>
      </section>

      <app-collection-editor heading="Galería" itemName="imagen" [items]="content.galleryItems()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteGalleryItem($event)" />
    </div>
  `,
})
export class GalleryAdmin {
  content = inject(ContentService);
  title = signal(this.content.galleryTitle());
  subtitle = signal(this.content.gallerySubtitle());

  blank: GalleryItem = { imageUrl: '', alt: '' };
  columns: ColumnDef[] = [
    { key: 'imageUrl', label: 'Imagen', type: 'image' },
    { key: 'alt', label: 'Descripción' },
  ];
  fields: FieldDef[] = [
    { key: 'imageUrl', label: 'Imagen (recomendado .webp, máx. 1280 px de ancho)', type: 'image', required: true },
    { key: 'alt', label: 'Descripción de la imagen (texto alternativo)', required: true, full: true, placeholder: 'Ej.: Guarda de seguridad Delfos en conjunto residencial' },
  ];

  saveHeader() {
    this.content.galleryTitle.set(this.title());
    this.content.updateGallerySubtitle(this.subtitle());
  }

  save(item: Record<string, any>) {
    const it = item as GalleryItem;
    if (this.content.galleryItems().some(x => x.id === it.id)) this.content.updateGalleryItem(it.id!, it);
    else this.content.addGalleryItem(it);
  }
}
