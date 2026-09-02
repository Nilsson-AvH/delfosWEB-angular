import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-news',
  imports: [SafeUrlPipe],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News {
  private contentService = inject(ContentService);
  title = this.contentService.newsTitle;
  subtitle = this.contentService.newsSubtitle;
  items = this.contentService.newsItems;

  // Manejo del Iframe Modal (Visor de Noticias)
  activeNewsIndex = signal<number | null>(null);

  openModal(index: number, event: Event) {
    event.preventDefault();
    this.activeNewsIndex.set(index);
  }

  closeModal(event?: Event) {
    if (event) event.preventDefault();
    this.activeNewsIndex.set(null);
  }
}
