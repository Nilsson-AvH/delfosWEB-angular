import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Header } from './shared/layout/header/header';
import { Footer } from './shared/layout/footer/footer';
import { SeoService } from './core/services/seo.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private metaService: Meta
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      // Título
      if (data['title']) {
        this.seoService.updateTitle(data['title']);
      }
      
      // Descripción
      if (data['description']) {
        this.seoService.updateDescription(data['description']);
      }

      // Robots
      if (data['robots']) {
        this.metaService.updateTag({ name: 'robots', content: data['robots'] });
      } else {
        this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
      }

      // Canonical
      const url = `https://www.seguridaddelfos.com${this.router.url}`;
      this.seoService.updateCanonicalUrl(url);
    });
  }
}
