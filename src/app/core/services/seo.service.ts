import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document
  ) { }

  updateTitle(title: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ property: 'og:title', content: title });
  }

  updateDescription(desc: string) {
    this.metaService.updateTag({ name: 'description', content: desc });
    this.metaService.updateTag({ property: 'og:description', content: desc });
  }

  updateCanonicalUrl(url: string) {
    const head = this.dom.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = this.dom.querySelector(`link[rel='canonical']`) || null;
    if (element == null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
    this.metaService.updateTag({ property: 'og:url', content: url });
  }
}
