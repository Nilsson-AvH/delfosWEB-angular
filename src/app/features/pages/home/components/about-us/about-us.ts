import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  private contentService = inject(ContentService);
  title = this.contentService.aboutUsTitle;
  items = this.contentService.aboutUsItems;

  // Manejo del Modal Informativo (Visor)
  activeItemIndex = signal<number | null>(null);

  openModal(index: number, event: Event) {
    event.preventDefault(); // Evita scroll top accidentales
    this.activeItemIndex.set(index);
  }

  closeModal(event?: Event) {
    if (event) event.preventDefault();
    this.activeItemIndex.set(null);
  }
}
