import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Icon } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Icon],
  template: `
    <div class="login grid-bg">
      <div class="login__card">
        <div class="login__form">
          <img src="images/logo-shield.webp" alt="Escudo Seguridad Delfos Ltda" width="64" height="58" class="login__logo">
          <h1>Delfos Seguridad</h1>
          <p class="login__sub">Acceso autorizado</p>

          <form (ngSubmit)="login()">
            <div class="field">
              <label for="pwd">Contraseña del sistema</label>
              <input id="pwd" class="input" type="password" [(ngModel)]="password" name="password" placeholder="••••••••"
                autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Verificar identidad</button>

            @if (error()) {
              <p class="login__error"><app-icon name="alert" [size]="18" /> {{ error() }}</p>
            }
          </form>

          <a routerLink="/" class="login__back"><app-icon name="arrow-left" [size]="16" /> Volver al sitio</a>
        </div>

        <aside class="login__side">
          <span class="login__shield"><app-icon name="shield-check" [size]="72" [stroke]="1.2" /></span>
          <h2>Panel administrativo</h2>
          <p>Plataforma exclusiva para la gestión de contenidos y configuración del portal de Delfos Ltda.</p>
        </aside>
      </div>
    </div>
  `,
  styles: `
    .login {
      position: relative;
      min-height: 100vh; min-height: 100dvh;
      display: grid; place-items: center;
      padding: 16px;
      background:
        linear-gradient(rgba(5,7,15,.86), rgba(5,7,15,.94)),
        url('/images/tu-imagen-ciudad-noche.webp') center / cover;
    }
    .login__card {
      position: relative;
      display: grid; grid-template-columns: 1fr;
      width: 100%; max-width: 880px;
      border-radius: 20px; overflow: hidden;
      background: rgba(12,16,34,.92);
      border: 1px solid rgba(242,103,35,.4);
      box-shadow: 0 0 50px rgba(242,103,35,.15), var(--shadow);
    }
    @media (min-width: 768px) { .login__card { grid-template-columns: 1.1fr 1fr; } }
    .login__form { padding: clamp(28px, 5vw, 52px); }
    .login__logo { width: 64px; height: auto; margin-bottom: 16px; filter: drop-shadow(0 0 12px rgba(244,181,39,.45)); }
    h1 { font-size: 3.4rem; text-transform: uppercase; letter-spacing: .04em; }
    .login__sub { font-family: var(--font-display); text-transform: uppercase; letter-spacing: .3em; font-size: 1.4rem; color: var(--orange-neon); margin: 6px 0 32px; }
    form { display: grid; gap: 20px; }
    .login__error { display: flex; gap: 10px; align-items: center; padding: 12px; border-radius: 10px; border: 1px solid rgba(209,36,32,.6); background: rgba(209,36,32,.1); color: #ffb4b2; font-size: 1.45rem; }
    .login__back { display: inline-flex; align-items: center; gap: 8px; margin-top: 28px; color: var(--muted); font-size: 1.45rem; transition: color .2s; }
    .login__back:hover { color: #fff; }
    .login__side {
      display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center;
      padding: 48px; gap: 14px;
      background: radial-gradient(circle at 50% 30%, rgba(242,103,35,.18), transparent 60%), linear-gradient(160deg, #0b1022, #05070f);
      border-left: 1px solid var(--border);
    }
    @media (min-width: 768px) { .login__side { display: flex; } }
    .login__shield { color: var(--orange-neon); filter: drop-shadow(0 0 16px rgba(242,103,35,.7)); }
    .login__side h2 { font-size: 2.4rem; text-transform: uppercase; letter-spacing: .06em; }
    .login__side p { color: var(--muted); font-size: 1.5rem; max-width: 300px; }
  `
})
export class LoginComponent {
  private authService = inject(AuthService);

  password = '';
  error = signal('');

  login() {
    if (this.authService.login(this.password)) {
      // Recarga completa para que la petición pase por Cloudflare Access
      window.location.href = '/admin';
    } else {
      this.error.set('La contraseña es demasiado corta');
    }
  }
}
