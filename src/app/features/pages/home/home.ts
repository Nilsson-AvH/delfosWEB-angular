import { Component } from '@angular/core';
import { Carousel } from './components/carousel/carousel';
import { AboutUs } from './components/about-us/about-us';
import { OurServices } from './components/our-services/our-services';
import { Indicators } from './components/indicators/indicators';
import { Gallery } from './components/gallery/gallery';
import { Testimonials } from './components/testimonials/testimonials';
import { News } from './components/news/news';
import { PreFooter } from './components/pre-footer/pre-footer';
import { Pqrs } from './components/pqrs/pqrs';
import { FloatingButton } from '../../../shared/components/floating-button/floating-button';

// Título, descripción y canonical se gestionan en app.ts a partir de los datos de la ruta.
@Component({
  selector: 'app-home',
  imports: [Carousel, AboutUs, OurServices, Indicators, Gallery, Testimonials, News, Pqrs, PreFooter, FloatingButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {}
