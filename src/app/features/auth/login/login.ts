import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-box">
          <h2>Delfos Security</h2>
          <p class="subtitle">Acceso Autorizado</p>
          <form (ngSubmit)="login()">
            <div class="form-group">
              <label>Contraseña de Sistema</label>
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-primary">Verificar Identidad</button>
            
            @if (error()) {
              <div class="error-badge">
                <i class="fa-solid fa-triangle-exclamation"></i> {{ error() }}
              </div>
            }
          </form>
          <a routerLink="/" class="back-home"><i class="fa-solid fa-arrow-left"></i> Volver a Navegación</a>
        </div>
        <div class="login-decoration">
          <!-- Textura o información secundaria -->
          <i class="fa-solid fa-shield-halved huge-icon"></i>
          <h3>Panel Administrativo</h3>
          <p>Plataforma exclusiva para gestión de contenidos y configuración del portal Delfos Ltda.</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .login-container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 100vh; 
      /* Utilizamos el Background image del parallax del home como textura oscura de fondo */
      background: linear-gradient(rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.95)), url('/images/tu-imagen-ciudad-noche.webp');
      background-size: cover;
      background-position: center;
      padding: 2rem;
    }
    
    .login-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 900px;
      background: var(--Background-Dark, #141414);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    @media (min-width: 768px) {
      .login-wrapper {
        flex-direction: row;
        min-height: 500px;
      }
    }
    
    .login-box { 
      flex: 1;
      padding: 5rem 4rem; 
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .login-decoration {
      flex: 1;
      background: linear-gradient(135deg, var(--Charleston-Green, #1f1f1f) 0%, #0a0a0a 100%);
      padding: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-left: 1px solid rgba(255,255,255,0.05);
      display: none; /* Oculto en móbiles */
    }
    
    @media (min-width: 768px) {
      .login-decoration {
        display: flex;
      }
    }
    
    .huge-icon {
      font-size: 8rem;
      color: var(--Halloween-Orange, #F26723);
      margin-bottom: 2rem;
      opacity: 0.8;
    }
    
    .login-decoration p {
      color: var(--Dim-Gray, #8b8b8b);
      font-size: 1.6rem;
      max-width: 300px;
      line-height: 1.6;
    }
    
    h2 { 
      font-family: 'Oswald', sans-serif; 
      color: var(--Lotion, #fff); 
      font-size: 4rem;
      margin: 0 0 0.5rem 0; 
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .subtitle {
      color: var(--Halloween-Orange, #F26723);
      font-family: 'Oswald', sans-serif;
      font-size: 1.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 0;
      margin-bottom: 4rem;
    }
    
    .form-group { 
      margin-bottom: 2.5rem; 
      text-align: left; 
    }
    
    .form-group label { 
      display: block; 
      margin-bottom: 1rem; 
      font-weight: 500; 
      color: var(--Dim-Gray, #8b8b8b); 
      font-size: 1.4rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .form-group input { 
      width: 100%; 
      padding: 1.6rem; 
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1); 
      color: white;
      border-radius: 8px; 
      box-sizing: border-box; 
      font-size: 1.8rem; /* Mayor accesibilidad */
      font-family: 'Roboto', sans-serif;
      transition: all 0.3s ease;
    }
    
    .form-group input:focus { 
      border-color: var(--Halloween-Orange, #F26723); 
      background: rgba(242, 103, 35, 0.05); /* Toque anaranjado muy sutil */
      outline: none; 
      box-shadow: 0 0 0 4px rgba(242, 103, 35, 0.1);
    }
    
    .btn-primary { 
      width: 100%; 
      padding: 1.6rem; 
      font-size: 1.8rem;
      margin-top: 1rem;
    }
    
    .error-badge { 
      background: rgba(209, 36, 32, 0.1); /* Maximun Red con alpha */
      border: 1px solid var(--Maximun-Red, #D12420);
      color: #ff6b6b; 
      padding: 1.2rem;
      border-radius: 6px;
      margin-top: 2rem; 
      font-size: 1.4rem; 
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .back-home { 
      display: inline-flex; 
      align-items: center;
      gap: 0.8rem;
      margin-top: 3.5rem; 
      text-decoration: none; 
      color: var(--Dim-Gray, #8b8b8b); 
      font-weight: 500; 
      font-size: 1.5rem; 
      transition: color 0.3s; 
    }
    
    .back-home:hover { 
      color: var(--Lotion, #fff); 
    }
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  password = '';
  error = signal('');

  login() {
    if (this.authService.login(this.password)) {
      // Usamos window.location.href en lugar de router.navigate para forzar
      // una recarga de la página y que la petición pase por Cloudflare Access
      window.location.href = '/admin';
    } else {
      this.error.set('Contraseña muy corta');
    }
  }
}
