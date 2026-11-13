import { Component, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url.pipe';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Modal } from '../../../../../shared/components/modal/modal';
import { Reveal } from '../../../../../shared/directives/reveal';

@Component({
  selector: 'app-news',
  imports: [SafeUrlPipe, Icon, Modal, Reveal],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News {
  private contentService = inject(ContentService);
  title = this.contentService.newsTitle;
  subtitle = this.contentService.newsSubtitle;
  items = this.contentService.newsItems;

  activeNewsIndex = signal<number | null>(null);
  activeItem = computed(() => {
    const i = this.activeNewsIndex();
    return i === null ? null : this.items()[i] ?? null;
  });

  frameLoaded = signal(false);

  openModal(index: number) { this.frameLoaded.set(false); this.activeNewsIndex.set(index); }
  closeModal() { this.activeNewsIndex.set(null); }
}
