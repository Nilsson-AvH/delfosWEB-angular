import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { PqrsContent } from '../../../../core/models/content.interface';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-pqrs-admin',
  imports: [FormsModule, Icon],
  template: `
    <div class="adm-page">
      <header class="adm-page__head">
        <h1>PQRS</h1>
        <p>Canal de peticiones, quejas, reclamos, sugerencias y denuncias. El visitante diligencia el formulario y lo envía desde su
          propio correo con el asunto “PQRS WEB DELFOS - (su asunto)”.</p>
      </header>

      <section class="adm-card">
        <header class="adm-card__head"><div><h2>Configuración</h2></div></header>
        <form class="adm-grid" (ngSubmit)="save()">
          <div class="field adm-span-2"><label for="pq-title">Título de la franja</label>
            <input id="pq-title" class="input" [(ngModel)]="form.title" name="title" required></div>
          <div class="field adm-span-2"><label for="pq-text">Texto</label>
            <textarea id="pq-text" class="input" rows="3" [(ngModel)]="form.text" name="text"></textarea></div>
          <div class="field"><label for="pq-email">Correo que recibe las PQRS</label>
            <input id="pq-email" class="input" type="email" [(ngModel)]="form.email" name="email" required></div>
          <div class="field"><label for="pq-btn">Texto del botón</label>
            <input id="pq-btn" class="input" [(ngModel)]="form.buttonText" name="buttonText" required></div>
          <div class="adm-actions adm-span-2">
            <button type="submit" class="btn btn--primary"><app-icon name="save" [size]="16" /> Guardar cambios</button>
          </div>
        </form>
      </section>
    </div>
  `,
})
export class PqrsAdmin {
  private content = inject(ContentService);
  form: PqrsContent = { ...this.content.pqrs() };

  save() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.form.email.trim())) {
      this.content.notify('El correo no es válido', 'error');
      return;
    }
    this.content.updatePqrs({ ...this.form, email: this.form.email.trim() });
  }
}
