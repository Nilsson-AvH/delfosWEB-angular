import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./features/pages/home/home').then(m => m.HomeComponent),
        data: {
          title: 'Delfos Seguridad Privada | Vigilancia y Escoltas en Bogotá',
          description: 'Líderes en vigilancia y seguridad privada en Bogotá, Colombia. Servicios de escoltas, CCTV y guardias con licencia de la Superintendencia.'
        }
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
        data: {
          title: 'Ingreso al Portal | Delfos Seguridad',
          description: 'Acceso seguro al portal administrativo de Delfos Seguridad Privada.'
        }
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
        data: {
          title: 'Panel Administrativo | Delfos',
          robots: 'noindex, nofollow' // Prevenir indexación del admin
        }
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },

];
