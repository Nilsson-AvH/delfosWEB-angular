import { Component, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal, computed } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Modal } from '../../../../../shared/components/modal/modal';

@Component({
  selector: 'app-carousel',
  imports: [Icon, Modal],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements AfterViewInit, OnDestroy {
  private contentService = inject(ContentService);
  slides = this.contentService.slides;
  cleanPhone = computed(() => this.contentService.contactNumber().replace(/\D/g, ''));

  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLElement>;

  currentIndex = signal(0);
  activeIndex = signal<number | null>(null);
  activeSlide = computed(() => {
    const i = this.activeIndex();
    return i === null ? null : this.slides()[i] ?? null;
  });

  private autoPlayInterval?: ReturnType<typeof setInterval>;
  private scrollRaf = 0;

  ngAfterViewInit() { this.startAutoPlay(); }
  ngOnDestroy() { this.stopAutoPlay(); cancelAnimationFrame(this.scrollRaf); }

  onScroll() {
    cancelAnimationFrame(this.scrollRaf);
    this.scrollRaf = requestAnimationFrame(() => {
      const el = this.carouselContainer?.nativeElement;
      if (!el) return;
      this.currentIndex.set(Math.round(el.scrollLeft / el.offsetWidth));
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (this.activeIndex() !== null) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.autoPlayInterval = setInterval(() => this.goTo((this.currentIndex() + 1) % this.slides().length, false), 6500);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

  next() { this.goTo((this.currentIndex() + 1) % this.slides().length); }
  prev() { this.goTo((this.currentIndex() - 1 + this.slides().length) % this.slides().length); }

  goTo(index: number, restart = true) {
    const el = this.carouselContainer?.nativeElement;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
    this.currentIndex.set(index);
    if (restart) this.startAutoPlay();
  }

  openDetails(index: number) {
    this.stopAutoPlay();
    this.activeIndex.set(index);
  }

  closeDetails() {
    this.activeIndex.set(null);
    this.startAutoPlay();
  }

  whatsappText(title: string) {
    return encodeURIComponent(`Hola, quiero información sobre el servicio de ${title}.`);
  }
}
