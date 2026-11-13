import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { Slide } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';

@Component({
  selector: 'app-carousel-admin',
  imports: [CollectionEditor],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Carrusel principal</h1>
        <p>Diapositivas de la portada. El botón de cada diapositiva abre una ventana con el “texto ampliado” (o el texto principal si está vacío).</p>
      </header>
      <app-collection-editor heading="Diapositivas" itemName="diapositiva" [items]="content.slides()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteSlide($event)" />
    </div>
  `,
})
export class CarouselAdmin {
  content = inject(ContentService);

  blank: Slide = { title: '', text: '', details: '', imageDesktop: '', imageMobile: '', linkText: 'Ver más', linkUrl: '' };

  columns: ColumnDef[] = [
    { key: 'imageDesktop', label: 'Imagen', type: 'image' },
    { key: 'title', label: 'Título' },
    { key: 'text', label: 'Texto' },
  ];

  fields: FieldDef[] = [
    { key: 'title', label: 'Título', required: true, full: true },
    { key: 'text', label: 'Texto principal', type: 'textarea', required: true },
    { key: 'details', label: 'Texto ampliado (ventana “Ver más”)', type: 'textarea', hint: 'Opcional. Si se deja vacío se muestra el texto principal.' },
    { key: 'imageDesktop', label: 'Imagen escritorio (recomendado 1700×610, .webp)', type: 'image', required: true },
    { key: 'imageMobile', label: 'Imagen móvil (recomendado 800×1000, .webp)', type: 'image' },
    { key: 'linkText', label: 'Texto del botón', placeholder: 'Ver más' },
    { key: 'linkUrl', label: 'Enlace externo (opcional)', placeholder: 'https://…', hint: 'Si se indica, aparece un botón “Más información” en la ventana.' },
  ];

  save(item: Record<string, any>) {
    const slide = item as Slide;
    if (this.content.slides().some(s => s.id === slide.id)) this.content.updateSlide(slide.id!, slide);
    else this.content.addSlide(slide);
  }
}
