import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isLoggedIn = signal<boolean>(false);

    // Expose read-only signal
    isLoggedIn = this._isLoggedIn.asReadonly();

    constructor(private router: Router) {
        // Check session storage for persistence of login session during refresh
        const stored = sessionStorage.getItem('delfos_auth');
        if (stored === 'true') {
            this._isLoggedIn.set(true);
        }
    }

    login(password: string): boolean {
        // La validación de seguridad real ahora la manejará Cloudflare Access.
        // A nivel de Angular, solo verificamos que hayan ingresado una contraseña 
        // para mantener el flujo visual de la página de login.
        if (password && password.length >= 4) {
            this._isLoggedIn.set(true);
            sessionStorage.setItem('delfos_auth', 'true');
            return true;
        }
        return false;
    }

    logout() {
        this._isLoggedIn.set(false);
        sessionStorage.removeItem('delfos_auth');
        this.router.navigate(['/login']);
    }
}
