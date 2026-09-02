import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  private contentService = inject(ContentService);
  title = this.contentService.galleryTitle;
  subtitle = this.contentService.gallerySubtitle;
  items = this.contentService.galleryItems;

  // Manejo del Lightbox (Visor de Imágenes)
  activeImageIndex = signal<number | null>(null);

  openLightbox(index: number, event: Event) {
    event.preventDefault(); // Evita el ancla/hasheo
    this.activeImageIndex.set(index);
  }

  closeLightbox(event?: Event) {
    if (event) event.preventDefault();
    this.activeImageIndex.set(null);
  }

  prevImage(event: Event) {
    event.preventDefault();
    const currentIndex = this.activeImageIndex();
    if (currentIndex !== null) {
      const itemsCount = this.items().length;
      const newIndex = currentIndex === 0 ? itemsCount - 1 : currentIndex - 1;
      this.activeImageIndex.set(newIndex);
    }
  }

  nextImage(event: Event) {
    event.preventDefault();
    const currentIndex = this.activeImageIndex();
    if (currentIndex !== null) {
      const itemsCount = this.items().length;
      const newIndex = currentIndex === itemsCount - 1 ? 0 : currentIndex + 1;
      this.activeImageIndex.set(newIndex);
    }
  }
}
