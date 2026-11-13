import { Component, HostListener, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Modal } from '../../../../../shared/components/modal/modal';
import { Reveal } from '../../../../../shared/directives/reveal';

@Component({
  selector: 'app-gallery',
  imports: [Icon, Modal, Reveal],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  private contentService = inject(ContentService);
  title = this.contentService.galleryTitle;
  subtitle = this.contentService.gallerySubtitle;
  items = this.contentService.galleryItems;

  activeImageIndex = signal<number | null>(null);

  openLightbox(index: number) { this.activeImageIndex.set(index); }
  closeLightbox() { this.activeImageIndex.set(null); }

  prevImage() {
    const i = this.activeImageIndex();
    if (i !== null) this.activeImageIndex.set((i - 1 + this.items().length) % this.items().length);
  }

  nextImage() {
    const i = this.activeImageIndex();
    if (i !== null) this.activeImageIndex.set((i + 1) % this.items().length);
  }

  @HostListener('document:keydown.arrowleft') onLeft() { if (this.activeImageIndex() !== null) this.prevImage(); }
  @HostListener('document:keydown.arrowright') onRight() { if (this.activeImageIndex() !== null) this.nextImage(); }
}
