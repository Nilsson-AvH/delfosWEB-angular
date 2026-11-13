import { Injectable, DOCUMENT, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private dom = inject(DOCUMENT);

  updateTitle(title: string) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
  }

  setRobots(content: string) {
    this.meta.updateTag({ name: 'robots', content });
  }

  updateCanonicalUrl(url: string) {
    let element = this.dom.querySelector<HTMLLinkElement>(`link[rel='canonical']`);
    if (!element) {
      element = this.dom.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.dom.head.appendChild(element);
    }
    element.setAttribute('href', url);
    this.meta.updateTag({ property: 'og:url', content: url });
  }
}
