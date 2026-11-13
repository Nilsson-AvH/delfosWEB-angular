import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { Testimonial } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-testimonials-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Testimonios</h1>
        <p>Opiniones de clientes que aparecen en la portada.</p>
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

      <app-collection-editor heading="Testimonios" itemName="testimonio" [items]="content.testimonials()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteTestimonial($event)" />
    </div>
  `,
})
export class TestimonialsAdmin {
  content = inject(ContentService);
  title = signal(this.content.testimonialsTitle());
  subtitle = signal(this.content.testimonialsSubtitle());

  blank: Testimonial = { text: '', authorName: '', authorRole: '', authorImage: '' };
  columns: ColumnDef[] = [
    { key: 'authorImage', label: 'Foto', type: 'image' },
    { key: 'authorName', label: 'Nombre' },
    { key: 'authorRole', label: 'Cargo / Empresa' },
  ];
  fields: FieldDef[] = [
    { key: 'authorName', label: 'Nombre', required: true },
    { key: 'authorRole', label: 'Cargo / Empresa', required: true },
    { key: 'text', label: 'Testimonio', type: 'textarea', required: true },
    { key: 'authorImage', label: 'Foto (cuadrada)', type: 'image' },
  ];

  saveHeader() {
    this.content.testimonialsTitle.set(this.title());
    this.content.updateTestimonialsSubtitle(this.subtitle());
  }

  save(item: Record<string, any>) {
    const it = item as Testimonial;
    if (this.content.testimonials().some(x => x.id === it.id)) this.content.updateTestimonial(it.id!, it);
    else this.content.addTestimonial(it);
  }
}
