import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Reveal } from '../../../../../shared/directives/reveal';

@Component({
  selector: 'app-indicators',
  imports: [Reveal],
  templateUrl: './indicators.html',
  styleUrl: './indicators.scss',
})
export class Indicators {
  private contentService = inject(ContentService);
  title = this.contentService.indicatorsTitle;
  indicators = this.contentService.indicators;

  /** Números formateados (es-CO) que se animan al aparecer en pantalla. */
  private fmt = new Intl.NumberFormat('es-CO');
  // Valor final desde el inicio (lo leen los buscadores); la animación arranca desde 0 al hacerse visible.
  display = signal<string[]>(this.indicators().map(i => this.fmt.format(Number(i.number) || 0)));

  animate() {
    const targets = this.indicators().map(i => Number(i.number) || 0);
    const duration = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      this.display.set(targets.map(t => this.fmt.format(Math.round(t * eased))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
