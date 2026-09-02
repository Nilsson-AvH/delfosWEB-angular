import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { CarouselAdmin } from './pages/carousel-admin/carousel-admin';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'header', loadComponent: () => import('./pages/header-admin/header-admin').then(m => m.HeaderAdmin) },
      { path: 'carousel', component: CarouselAdmin },
      { path: 'about', loadComponent: () => import('./pages/about-admin/about-admin').then(m => m.AboutAdmin) },
      { path: 'services', loadComponent: () => import('./pages/services-admin/services-admin').then(m => m.ServicesAdmin) },
      { path: 'indicators', loadComponent: () => import('./pages/indicators-admin/indicators-admin').then(m => m.IndicatorsAdmin) },
      { path: 'gallery', loadComponent: () => import('./pages/gallery-admin/gallery-admin').then(m => m.GalleryAdmin) },
      { path: 'testimonials', loadComponent: () => import('./pages/testimonials-admin/testimonials-admin').then(m => m.TestimonialsAdmin) },
      { path: 'news', loadComponent: () => import('./pages/news-admin/news-admin').then(m => m.NewsAdmin) },
      { path: 'pre-footer', loadComponent: () => import('./pages/pre-footer-admin/pre-footer-admin').then(m => m.PreFooterAdmin) },
      { path: 'footer', loadComponent: () => import('./pages/footer-admin/footer-admin').then(m => m.FooterAdmin) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
