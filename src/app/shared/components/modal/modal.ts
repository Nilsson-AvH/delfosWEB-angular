import { Component, DOCUMENT, HostListener, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Ventana modal estándar del sitio (información, noticias, galería, formularios del admin).
 * Tamaño ajustado al contenido; cierra con Esc, clic fuera o el botón ✕.
 * Los estilos viven en styles.scss (.modal*).
 */
@Component({
  selector: 'app-modal',
  imports: [Icon],
  template: `
    <div class="modal-backdrop" (click)="closed.emit()">
      <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="label()"
        [class.modal--wide]="size() === 'wide'" [class.modal--media]="size() === 'media'"
        (click)="$event.stopPropagation()">
        <button type="button" class="btn btn--icon modal__close" (click)="closed.emit()" aria-label="Cerrar">
          <app-icon name="x" [size]="20" />
        </button>
        <ng-content />
      </div>
    </div>
  `,
})
export class Modal implements OnInit, OnDestroy {
  label = input<string>('Ventana');
  size = input<'default' | 'wide' | 'media'>('default');
  closed = output<void>();

  private doc = inject(DOCUMENT);

  ngOnInit() { this.doc.body.classList.add('no-scroll'); }
  ngOnDestroy() { this.doc.body.classList.remove('no-scroll'); }

  @HostListener('document:keydown.escape')
  onEsc() { this.closed.emit(); }
}
