import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { ContentLink, FooterAbout } from '../../../../core/models/content.interface';
import { CollectionEditor } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';
import { LINK_COLUMNS, LINK_FIELDS } from '../header-admin/header-admin';

@Component({
  selector: 'app-footer-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Pie de página</h1>
        <p>Información de la empresa y enlaces de la columna “Enlaces”. Las columnas de noticias y contacto se generan automáticamente.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Información de la empresa</h2></div></header>
        <div class="adm-grid">
          <div class="field adm-span-2"><label for="ft-title">Nombre de la empresa</label>
            <input id="ft-title" class="input" [(ngModel)]="about.title" name="title"></div>
          <div class="field adm-span-2"><label for="ft-desc">Descripción</label>
            <textarea id="ft-desc" class="input" rows="4" [(ngModel)]="about.description" name="desc"></textarea></div>
        </div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="content.updateFooterAbout({ ...about })"><app-icon name="save" [size]="15" /> Guardar información</button>
        </div>
      </section>

      <app-collection-editor heading="Enlaces" itemName="enlace" [items]="content.footerMainLinks()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="saveLink($event)" (removed)="content.deleteFooterMainLink($event)" />
    </div>
  `,
})
export class FooterAdmin {
  content = inject(ContentService);
  about: FooterAbout = { ...this.content.footerAbout() };
  columns = LINK_COLUMNS;
  fields = LINK_FIELDS;
  blank: ContentLink = { text: '', type: 'internal', target: '#section-' };

  saveLink(item: Record<string, any>) {
    const l = item as ContentLink;
    if (this.content.footerMainLinks().some(x => x.id === l.id)) this.content.updateFooterMainLink(l.id!, l);
    else this.content.addFooterMainLink(l);
  }
}
