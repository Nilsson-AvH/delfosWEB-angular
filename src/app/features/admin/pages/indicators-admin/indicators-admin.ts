import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { Indicator } from '../../../../core/models/content.interface';
import { CollectionEditor, ColumnDef, FieldDef } from '../../components/collection-editor';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-indicators-admin',
  imports: [FormsModule, CollectionEditor, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>Indicadores</h1>
        <p>Cifras animadas de la franja de indicadores (proyectos, personal, clientes…). Se recomiendan 4.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Frase principal</h2></div></header>
        <div class="field"><label for="i-title">Texto</label><textarea id="i-title" class="input" rows="3" [(ngModel)]="title" name="title"></textarea></div>
        <div class="adm-actions">
          <button type="button" class="btn btn--primary btn--sm" (click)="content.updateIndicatorsTitle(title())"><app-icon name="save" [size]="15" /> Guardar frase</button>
        </div>
      </section>

      <app-collection-editor heading="Cifras" itemName="indicador" [items]="content.indicators()"
        [fields]="fields" [columns]="columns" [blank]="blank"
        (saved)="save($event)" (removed)="content.deleteIndicator($event)" />
    </div>
  `,
})
export class IndicatorsAdmin {
  content = inject(ContentService);
  title = signal(this.content.indicatorsTitle());

  blank: Indicator = { number: 0, label: '' };
  columns: ColumnDef[] = [
    { key: 'number', label: 'Cifra' },
    { key: 'label', label: 'Etiqueta' },
  ];
  fields: FieldDef[] = [
    { key: 'number', label: 'Cifra', type: 'number', required: true },
    { key: 'label', label: 'Etiqueta', required: true },
  ];

  save(item: Record<string, any>) {
    const it = item as Indicator;
    if (this.content.indicators().some(x => x.id === it.id)) this.content.updateIndicator(it.id!, it);
    else this.content.addIndicator(it);
  }
}
