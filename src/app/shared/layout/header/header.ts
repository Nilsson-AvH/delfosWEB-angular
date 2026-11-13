import { Component, computed, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ContentService } from '../../../core/services/content.service';
import { ContentLink } from '../../../core/models/content.interface';
import { Icon } from '../../components/icon/icon';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon, Modal],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);
  private contentService = inject(ContentService);
  private elementRef = inject(ElementRef);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  contactNumber = this.contentService.contactNumber;
  utilsTitle = this.contentService.utilsTitle;
  utilsLinks = this.contentService.utilsLinks;
  headerLinks = this.contentService.headerLinks;
  social = this.contentService.socialLinks;
  cleanPhone = computed(() => this.contactNumber().replace(/\D/g, ''));

  isScrolled = signal(false);
  isSearchOpen = signal(false);
  isMobileMenuOpen = signal(false);
  isUtilsMenuOpen = signal(false);
  searchQuery = signal('');

  searchResults = computed(() => {
    const q = this.normalize(this.searchQuery());
    if (!q) return [];
    const results: { title: string; hash: string; type: string }[] = [];

    this.contentService.services().forEach(s => {
      if (this.normalize(s.title + ' ' + s.description).includes(q)) {
        results.push({ title: s.title, hash: 'section-services', type: 'Servicio' });
      }
    });
    this.contentService.slides().forEach(s => {
      if (this.normalize(s.title + ' ' + s.text).includes(q)) {
        results.push({ title: s.title, hash: 'section-carousel', type: 'Destacado' });
      }
    });
    this.contentService.newsItems().forEach(n => {
      if (this.normalize(n.title + ' ' + (n.description || '')).includes(q)) {
        results.push({ title: n.title, hash: 'section-news', type: 'Noticia' });
      }
    });
    this.contentService.headerLinks().forEach(l => {
      if (l.type === 'internal' && this.normalize(l.text).includes(q)) {
        results.push({ title: l.text, hash: l.target.replace(/^#/, ''), type: 'Sección' });
      }
    });
    return results;
  });

  private normalize(v: string) {
    return v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrolled = window.scrollY > 10;
    if (scrolled !== this.isScrolled()) this.isScrolled.set(scrolled);
  }

  toggleSearch(event: Event) {
    event.preventDefault();
    this.isMobileMenuOpen.set(false);
    this.isSearchOpen.update(v => !v);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
    this.searchQuery.set('');
  }

  toggleMobileMenu(event: Event) {
    event.preventDefault();
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleUtilsMenu(event: Event) {
    event.preventDefault();
    this.isUtilsMenuOpen.update(v => !v);
  }

  goHome(event: Event) {
    event.preventDefault();
    this.isMobileMenuOpen.set(false);
    this.router.navigateByUrl('/').then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  handleSearchResultClick(event: Event, hash: string) {
    event.preventDefault();
    this.closeSearch();
    this.scrollToSection(hash);
  }

  logout(event: Event) {
    event.preventDefault();
    this.isUtilsMenuOpen.set(false);
    this.authService.logout();
  }

  handleLinkClick(event: Event, link: ContentLink) {
    event.preventDefault();
    if (link.type === 'internal') {
      this.scrollToSection(link.target.replace(/^#/, ''));
    } else if (link.type === 'route') {
      this.router.navigateByUrl(link.target).then(() => {
        if (link.target === '/' ) window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      window.open(link.target, '_blank', 'noopener');
    }
  }

  private scrollToSection(id: string) {
    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const host = this.elementRef.nativeElement as HTMLElement;
    if (!host.querySelector('.utils')?.contains(target)) this.isUtilsMenuOpen.set(false);
    if (!host.querySelector('.nav')?.contains(target) && !host.querySelector('.hamburger')?.contains(target)) {
      this.isMobileMenuOpen.set(false);
    }
  }
}
