import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { NewsItem } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-news-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Noticias</h1>
        <p>Tarjetas de noticias. Al hacer clic se abre una ventana con el texto y/o el artículo externo incrustado.</p>
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

      <app-collection-editor heading="Noticias" itemName="noticia" [items]="content.newsItems()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteNewsItem($event)" />
    </div>
  `,
})
export class NewsAdmin {
  content = inject(ContentService);
  title = signal(this.content.newsTitle());
  subtitle = signal(this.content.newsSubtitle());

  blank: NewsItem = { title: '', imageUrl: '', linkUrl: '', iframeUrl: '', description: '', source: '' };
  columns: ColumnDef[] = [
    { key: 'imageUrl', label: 'Imagen', type: 'image' },
    { key: 'title', label: 'Título' },
    { key: 'source', label: 'Fuente' },
  ];
  fields: FieldDef[] = [
    { key: 'title', label: 'Título', required: true, full: true },
    { key: 'source', label: 'Fuente y fecha', placeholder: 'Supervigilancia · julio de 2025' },
    { key: 'linkUrl', label: 'Enlace a la noticia original', placeholder: 'https://…' },
    { key: 'description', label: 'Resumen de la noticia', type: 'textarea' },
    { key: 'iframeUrl', label: 'Artículo externo (URL, opcional)', full: true, placeholder: 'https://…', hint: 'Debe ser una página que permita mostrarse dentro de otros sitios. La Supervigilancia sí lo permite; El Tiempo, la Policía Nacional y la mayoría de periódicos lo bloquean (en ese caso deja este campo vacío y usa solo el enlace).' },
    { key: 'imageUrl', label: 'Imagen', type: 'image', required: true },
  ];

  saveHeader() {
    this.content.newsTitle.set(this.title());
    this.content.updateNewsSubtitle(this.subtitle());
  }

  save(item: Record<string, any>) {
    const it = item as NewsItem;
    if (this.content.newsItems().some(x => x.id === it.id)) this.content.updateNewsItem(it.id!, it);
    else this.content.addNewsItem(it);
  }
}
