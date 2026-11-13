import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/pages/home/home').then(m => m.HomeComponent),
        data: {
            title: 'Seguridad Privada en Bogotá | Vigilancia, Escoltas y CCTV · Delfos Ltda',
            description: 'Seguridad Delfos Ltda: empresa de vigilancia y seguridad privada en Bogotá con más de 25 años de experiencia. Guardas de seguridad, escoltas, monitoreo CCTV 24/7, patrullaje y control biométrico. Vigilada por la Supervigilancia.'
        }
    },
    // Compatibilidad con enlaces antiguos
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
        data: {
            title: 'Ingreso al portal | Delfos Seguridad',
            description: 'Acceso seguro al portal administrativo de Delfos Seguridad Privada.',
            robots: 'noindex, nofollow'
        }
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
        data: {
            title: 'Panel administrativo | Delfos',
            robots: 'noindex, nofollow'
        }
    },
    { path: '**', redirectTo: '' },
];
