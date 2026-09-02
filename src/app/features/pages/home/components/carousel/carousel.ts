import { Component, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements AfterViewInit, OnDestroy {
  private contentService = inject(ContentService);
  slides = this.contentService.slides;

  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLElement>;

  currentIndex = 0;
  private autoPlayInterval: any;

  ngAfterViewInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  onScroll() {
    if (!this.carouselContainer) return;
    const container = this.carouselContainer.nativeElement;
    const itemWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    // Calcular el índice basado en la posición del scroll
    this.currentIndex = Math.round(scrollLeft / itemWidth);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000); // Cambiar diapositiva cada 5 segundos
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  reStartAutoPlay() {
    this.startAutoPlay();
  }

  next() {
    if (!this.carouselContainer) return;
    const totalSlides = this.slides().length;
    let nextIndex = this.currentIndex + 1;
    if (nextIndex >= totalSlides) {
      nextIndex = 0; // Volver al inicio
    }
    this.goTo(nextIndex);
    this.reStartAutoPlay();
  }

  prev() {
    if (!this.carouselContainer) return;
    const totalSlides = this.slides().length;
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = totalSlides - 1; // Ir al final
    }
    this.goTo(prevIndex);
    this.reStartAutoPlay();
  }

  goTo(index: number) {
    if (!this.carouselContainer) return;
    const container = this.carouselContainer.nativeElement;
    const itemWidth = container.offsetWidth;
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
    this.currentIndex = index;
    this.reStartAutoPlay();
  }
}
