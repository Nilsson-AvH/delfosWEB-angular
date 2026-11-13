import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { ContentLink } from '../../../core/models/content.interface';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private contentService = inject(ContentService);
  private router = inject(Router);

  footerAbout = this.contentService.footerAbout;
  footerMainLinks = this.contentService.footerMainLinks;
  contactNumber = this.contentService.contactNumber;
  latestNews = computed(() => this.contentService.newsItems().slice(-3).reverse());
  pqrsEmail = computed(() => this.contentService.pqrs().email);
  socialList = computed(() => {
    const s = this.contentService.socialLinks();
    return [
      { name: 'instagram', label: 'Instagram', url: s.instagram },
      { name: 'facebook', label: 'Facebook', url: s.facebook },
      { name: 'tiktok', label: 'TikTok', url: s.tiktok },
      { name: 'linkedin', label: 'LinkedIn', url: s.linkedin },
    ].filter(x => !!x.url);
  });
  cleanPhone = computed(() => this.contactNumber().replace(/\D/g, ''));
  currentYear = new Date().getFullYear();

  goTop(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/').then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  scrollTo(event: Event, id: string) {
    event.preventDefault();
    this.router.navigateByUrl('/').then(() =>
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60));
  }

  handleLinkClick(event: Event, link: ContentLink) {
    if (link.type === 'internal') {
      this.scrollTo(event, link.target.replace(/^#/, ''));
    } else if (link.type === 'route') {
      event.preventDefault();
      this.router.navigateByUrl(link.target);
    } else {
      event.preventDefault();
      window.open(link.target, '_blank', 'noopener');
    }
  }
}
