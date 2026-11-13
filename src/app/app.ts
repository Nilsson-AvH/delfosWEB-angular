import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Header } from './shared/layout/header/header';
import { Footer } from './shared/layout/footer/footer';
import { SeoService } from './core/services/seo.service';

const SITE_URL = 'https://seguridaddelfos.com';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private seo = inject(SeoService);

  /** El header/footer público no se muestran en el panel ni en el login. */
  isPublic = signal(!this.isPrivateUrl(location.pathname));

  private isPrivateUrl(url: string) {
    return url.startsWith('/admin') || url.startsWith('/login');
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => {
        this.isPublic.set(!this.isPrivateUrl(event.urlAfterRedirects));
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      if (data['title']) this.seo.updateTitle(data['title']);
      if (data['description']) this.seo.updateDescription(data['description']);
      this.seo.setRobots(data['robots'] || 'index, follow, max-image-preview:large');

      const path = this.router.url.split(/[?#]/)[0];
      this.seo.updateCanonicalUrl(`${SITE_URL}${path === '/' ? '/' : path}`);
    });
  }
}
