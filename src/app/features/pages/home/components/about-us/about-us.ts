import { Component, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Modal } from '../../../../../shared/components/modal/modal';
import { Reveal } from '../../../../../shared/directives/reveal';

@Component({
  selector: 'app-about-us',
  imports: [Icon, Modal, Reveal],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  private contentService = inject(ContentService);
  title = this.contentService.aboutUsTitle;
  items = this.contentService.aboutUsItems;

  activeItemIndex = signal<number | null>(null);
  activeItem = computed(() => {
    const i = this.activeItemIndex();
    return i === null ? null : this.items()[i] ?? null;
  });

  openModal(index: number) { this.activeItemIndex.set(index); }
  closeModal() { this.activeItemIndex.set(null); }
}
