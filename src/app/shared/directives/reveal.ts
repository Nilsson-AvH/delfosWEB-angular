import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input, output } from '@angular/core';

/**
 * Añade la clase "is-visible" cuando el elemento entra en pantalla (animación ligera con CSS).
 * Uso: <div appReveal> ... </div>  — emite (revealed) una sola vez.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class Reveal implements AfterViewInit, OnDestroy {
  revealDelay = input<number>(0);
  revealed = output<void>();

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    const node = this.el.nativeElement as HTMLElement;
    if (this.revealDelay()) node.style.transitionDelay = `${this.revealDelay()}ms`;
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      this.revealed.emit();
      return;
    }
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        node.classList.add('is-visible');
        this.revealed.emit();
        this.observer?.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    this.observer.observe(node);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
