import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { ContentLink, SocialLinks } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

export const LINK_TYPE_OPTIONS = [
  { value: 'internal', label: 'Sección de la página (#seccion)' },
  { value: 'route', label: 'Ruta interna (/ruta)' },
  { value: 'external', label: 'Enlace externo (https://…)' },
];

export const LINK_COLUMNS: ColumnDef[] = [
  { key: 'text', label: 'Texto' },
  { key: 'type', label: 'Tipo', type: 'badge' },
  { key: 'target', label: 'Destino' },
];

export const LINK_FIELDS: FieldDef[] = [
  { key: 'text', label: 'Texto del enlace', required: true },
  { key: 'type', label: 'Tipo de enlace', type: 'select', options: LINK_TYPE_OPTIONS },
  { key: 'target', label: 'Destino', required: true, full: true, placeholder: '#section-services, /ruta o https://…',
    hint: 'Secciones disponibles: #section-about, #section-services, #section-indicators, #section-gallery, #section-testimonials, #section-news, #section-contact' },
];

@Component({
  selector: 'app-header-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Encabezado</h1>
        <p>Teléfono de contacto, menú principal y menú de utilidades (icono de cuadrícula del encabezado).</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Datos generales</h2><p>El teléfono también se usa en el botón de WhatsApp y en el pie de página.</p></div></header>
        <div class="adm-grid">
          <div class="field"><label for="hd-phone">Teléfono de contacto</label>
            <input id="hd-phone" class="input" [(ngModel)]="phone" name="phone" placeholder="(+57) 300 000 0000"></div>
          <div class="field"><label for="hd-utils">Título del menú de utilidades</label>
            <input id="hd-utils" class="input" [(ngModel)]="utilsTitle" name="utils"></div>
        </div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="saveGeneral()"><app-icon name="save" [size]="15" /> Guardar datos</button>
        </div>
      </section>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Redes sociales</h2><p>Se muestran en el encabezado y en el pie de página. Deja vacío lo que no uses.</p></div></header>
        <div class="adm-grid">
          <div class="field"><label for="sc-ig">Instagram</label><input id="sc-ig" class="input" [(ngModel)]="social.instagram" name="ig" placeholder="https://www.instagram.com/…"></div>
          <div class="field"><label for="sc-fb">Facebook</label><input id="sc-fb" class="input" [(ngModel)]="social.facebook" name="fb" placeholder="https://www.facebook.com/…"></div>
          <div class="field"><label for="sc-tt">TikTok</label><input id="sc-tt" class="input" [(ngModel)]="social.tiktok" name="tt" placeholder="https://www.tiktok.com/@…"></div>
          <div class="field"><label for="sc-li">LinkedIn</label><input id="sc-li" class="input" [(ngModel)]="social.linkedin" name="li" placeholder="https://www.linkedin.com/company/…"></div>
        </div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="saveSocial()"><app-icon name="save" [size]="15" /> Guardar redes</button>
        </div>
      </section>

      <app-collection-editor heading="Menú principal" itemName="enlace" [items]="content.headerLinks()"
        [fields]="fields" [columns]="columns" [blank]="blankInternal"
        (saved)="saveHeaderLink($event)" (removed)="content.deleteHeaderLink($event)" />

      <app-collection-editor heading="Menú de utilidades" description="Accesos a plataformas externas (CRM, RondaKey, etc.)."
        itemName="enlace" [items]="content.utilsLinks()"
        [fields]="fields" [columns]="columns" [blank]="blankExternal"
        (saved)="saveUtilsLink($event)" (removed)="content.deleteUtilsLink($event)" />
    </div>
  `,
})
export class HeaderAdmin {
  content = inject(ContentService);
  phone = signal(this.content.contactNumber());
  utilsTitle = signal(this.content.utilsTitle());
  social: SocialLinks = { ...this.content.socialLinks() };

  saveSocial() {
    const clean = (v: string) => (v || '').trim();
    this.content.updateSocialLinks({
      instagram: clean(this.social.instagram), facebook: clean(this.social.facebook),
      tiktok: clean(this.social.tiktok), linkedin: clean(this.social.linkedin),
    });
  }

  columns = LINK_COLUMNS;
  fields = LINK_FIELDS;
  blankInternal: ContentLink = { text: '', type: 'internal', target: '#section-' };
  blankExternal: ContentLink = { text: '', type: 'external', target: 'https://' };

  saveGeneral() {
    this.content.contactNumber.set(this.phone());
    this.content.updateUtilsTitle(this.utilsTitle());
  }

  saveHeaderLink(item: Record<string, any>) {
    const l = item as ContentLink;
    if (this.content.headerLinks().some(x => x.id === l.id)) this.content.updateHeaderLink(l.id!, l);
    else this.content.addHeaderLink(l);
  }

  saveUtilsLink(item: Record<string, any>) {
    const l = item as ContentLink;
    if (this.content.utilsLinks().some(x => x.id === l.id)) this.content.updateUtilsLink(l.id!, l);
    else this.content.addUtilsLink(l);
  }
}
