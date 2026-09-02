import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Carousel } from './components/carousel/carousel';
import { AboutUs } from './components/about-us/about-us';
import { OurServices } from './components/our-services/our-services';
import { Indicators } from './components/indicators/indicators';
import { Gallery } from './components/gallery/gallery';
import { Testimonials } from './components/testimonials/testimonials';
import { News } from './components/news/news';
import { PreFooter } from './components/pre-footer/pre-footer';
import { FloatingButton } from '../../../shared/components/floating-button/floating-button';

@Component({
  selector: 'app-home',
  imports: [
    Carousel,
    AboutUs,
    OurServices,
    Indicators,
    Gallery,
    Testimonials,
    News,
    PreFooter,
    FloatingButton
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('Seguridad Delfos Ltda - Seguridad Privada y Vigilancia');
    this.metaService.addTags([
      { name: 'description', content: 'Empresa de vigilancia y seguridad privada con más de 20 años de experiencia. Ofrecemos seguridad física, electrónica, monitoreo 24/7 y escoltas.' },
      { name: 'keywords', content: 'seguridad privada, vigilancia, monitoreo, escoltas, camaras seguridad, delfos ltda' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Seguridad Delfos Ltda' },
      { property: 'og:description', content: 'Soluciones integrales de seguridad privada y vigilancia.' },
      { property: 'og:image', content: 'assets/images/big-logo.png' },
      { property: 'og:url', content: 'https://www.seguridaddelfos.com.co' }
    ]);
  }
}

