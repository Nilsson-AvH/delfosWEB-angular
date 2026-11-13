import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../../core/services/content.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-floating-button',
  imports: [Icon],
  templateUrl: './floating-button.html',
  styleUrl: './floating-button.scss'
})
export class FloatingButton {
  private contentService = inject(ContentService);
  cleanPhone = computed(() => this.contentService.contactNumber().replace(/\D/g, ''));
  showTop = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    const show = window.scrollY > 600;
    if (show !== this.showTop()) this.showTop.set(show);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
