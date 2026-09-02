import { Component, computed, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ContentService } from '../../../core/services/content.service';
import { ViewportScroller } from '@angular/common';
import { ContentLink } from '../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);
  private contentService = inject(ContentService);
  private elementRef = inject(ElementRef);
  router = inject(Router);
  viewportScroller = inject(ViewportScroller);
  isLoggedIn = this.authService.isLoggedIn;

  // Signals
  contactNumber = this.contentService.contactNumber;
  utilsTitle = this.contentService.utilsTitle;
  utilsLinks = this.contentService.utilsLinks;
  headerLinks = this.contentService.headerLinks;

  // Search Logic state
  isSearchOpen = signal(false);
  searchQuery = signal('');

  // Computed results merging multiple array titles from ContentService
  searchResults = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return [];

    const results: { title: string, hash: string, type: string }[] = [];

    // Buscar en Servicios
    this.contentService.services().forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        results.push({ title: s.title, hash: 'section-services', type: 'Service' });
      }
    });

    // Buscar en Noticias
    this.contentService.newsItems().forEach(n => {
      if (n.title.toLowerCase().includes(q)) {
        results.push({ title: n.title, hash: 'section-news', type: 'News' });
      }
    });

    // Buscar en Menú Principal
    this.contentService.headerLinks().forEach(l => {
      if (l.text.toLowerCase().includes(q) && l.type === 'internal') {
        const cleanHash = l.target.startsWith('#') ? l.target.substring(1) : l.target;
        results.push({ title: l.text, hash: cleanHash, type: 'Section' });
      }
    });

    return results;
  });

  toggleSearch(event: Event) {
    event.preventDefault();
    this.isSearchOpen.set(!this.isSearchOpen());
    if (!this.isSearchOpen()) {
      this.searchQuery.set(''); // clean on close
    }
  }

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(event: Event) {
    event.preventDefault();
    this.isMobileMenuOpen.update(val => !val);
  }

  isUtilsMenuOpen = signal(false);

  toggleUtilsMenu(event: Event) {
    event.preventDefault();
    this.isUtilsMenuOpen.update(val => !val);
  }

  handleSearchResultClick(event: Event, hash: string) {
    event.preventDefault();
    this.isSearchOpen.set(false);
    this.searchQuery.set('');

    const urlTree = this.router.createUrlTree(['/']);
    this.router.navigateByUrl(urlTree).then(() => {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }

  handleLinkClick(event: Event, link: ContentLink) {
    event.preventDefault();

    if (link.type === 'internal') {
      const urlTree = this.router.createUrlTree(['/']);
      this.router.navigateByUrl(urlTree).then(() => {
        // We expect the target to be like "#section" => extract "section"
        const anchor = link.target.startsWith('#') ? link.target.substring(1) : link.target;
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      });
    } else if (link.type === 'route') {
      this.router.navigate([link.target]);
    } else if (link.type === 'external') {
      window.open(link.target, '_blank');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check Utils menu
    const utilsDropdown = this.elementRef.nativeElement.querySelector('.utils-dropdown');
    if (utilsDropdown && !utilsDropdown.contains(target)) {
      this.isUtilsMenuOpen.set(false);
    }

    // Check Mobile Hamburger menu
    const mobileMenu = this.elementRef.nativeElement.querySelector('.header-menu');
    const hamburgerBtn = this.elementRef.nativeElement.querySelector('.hamburger-btn');
    if (mobileMenu && hamburgerBtn) {
      if (!mobileMenu.contains(target) && !hamburgerBtn.contains(target)) {
        this.isMobileMenuOpen.set(false);
      }
    }
  }
}

