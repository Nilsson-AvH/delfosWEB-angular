import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { ServiceItem } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-services-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Servicios</h1>
        <p>Tarjetas de servicios con icono, título y descripción.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Encabezado de la sección</h2></div></header>
        <div class="adm-grid">
          <div class="field"><label for="s-sub">Subtítulo (texto pequeño)</label><input id="s-sub" class="input" [(ngModel)]="subtitle" name="sub"></div>
          <div class="field"><label for="s-title">Título</label><input id="s-title" class="input" [(ngModel)]="title" name="title"></div>
        </div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="saveHeader()"><app-icon name="save" [size]="15" /> Guardar encabezado</button>
        </div>
      </section>

      <app-collection-editor heading="Lista de servicios" itemName="servicio" [items]="content.services()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteService($event)" />
    </div>
  `,
})
export class ServicesAdmin {
  content = inject(ContentService);
  title = signal(this.content.servicesTitle());
  subtitle = signal(this.content.servicesSubtitle());

  blank: ServiceItem = { title: '', description: '', icon: 'shield-check', iconBg: '' };
  columns: ColumnDef[] = [
    { key: 'icon', label: 'Icono', type: 'icon' },
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descripción' },
  ];
  fields: FieldDef[] = [
    { key: 'title', label: 'Título', required: true, full: true },
    { key: 'description', label: 'Descripción', type: 'textarea', required: true },
    { key: 'icon', label: 'Icono', type: 'icon', full: true },
  ];

  saveHeader() {
    this.content.servicesTitle.set(this.title());
    this.content.updateServicesSubtitle(this.subtitle());
  }

  save(item: Record<string, any>) {
    const it = item as ServiceItem;
    if (this.content.services().some(x => x.id === it.id)) this.content.updateService(it.id!, it);
    else this.content.addService(it);
  }
}
