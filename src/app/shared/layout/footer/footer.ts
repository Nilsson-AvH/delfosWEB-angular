import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { ContentLink } from '../../../core/models/content.interface';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private contentService = inject(ContentService);
  router = inject(Router);
  viewportScroller = inject(ViewportScroller);

  // Signals
  footerAbout = this.contentService.footerAbout;
  footerMainLinks = this.contentService.footerMainLinks;
  currentYear = new Date().getFullYear();

  handleLinkClick(event: Event, link: ContentLink) {
    event.preventDefault();

    if (link.type === 'internal') {
      const urlTree = this.router.createUrlTree(['/']);
      this.router.navigateByUrl(urlTree).then(() => {
        // We expect the target to be like "#section" => extract "section"
        const anchor = link.target.startsWith('#') ? link.target.substring(1) : link.target;
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(anchor);
        }, 100);
      });
    } else if (link.type === 'route') {
      this.router.navigate([link.target]);
    } else if (link.type === 'external') {
      window.open(link.target, '_blank');
    }
  }
}
