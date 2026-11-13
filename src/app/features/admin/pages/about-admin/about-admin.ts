import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { AboutUsItem } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-about-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Nosotros</h1>
        <p>Tarjetas de la sección “Nosotros” (experiencia, historia, misión…). Cada tarjeta abre una ventana con su descripción.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Título de la sección</h2></div></header>
        <div class="field">
          <label for="about-title">Título</label>
          <input id="about-title" class="input" [(ngModel)]="title" name="title">
        </div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="content.updateAboutUsTitle(title())"><app-icon name="save" [size]="15" /> Guardar título</button>
        </div>
      </section>

      <app-collection-editor heading="Tarjetas" itemName="tarjeta" [items]="content.aboutUsItems()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteAboutUsItem($event)" />
    </div>
  `,
})
export class AboutAdmin {
  content = inject(ContentService);
  title = signal(this.content.aboutUsTitle());

  blank: AboutUsItem = { title: '', imageUrl: '', description: '' };
  columns: ColumnDef[] = [
    { key: 'imageUrl', label: 'Imagen', type: 'image' },
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descripción' },
  ];
  fields: FieldDef[] = [
    { key: 'title', label: 'Título', required: true, full: true },
    { key: 'description', label: 'Descripción', type: 'textarea', required: true },
    { key: 'imageUrl', label: 'Imagen', type: 'image', required: true },
  ];

  save(item: Record<string, any>) {
    const it = item as AboutUsItem;
    if (this.content.aboutUsItems().some(x => x.id === it.id)) this.content.updateAboutUsItem(it.id!, it);
    else this.content.addAboutUsItem(it);
  }
}
