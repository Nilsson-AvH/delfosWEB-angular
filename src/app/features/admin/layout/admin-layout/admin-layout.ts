import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="admin-container">
      <aside class="sidebar" [class.open]="isSidebarOpen()">
        <div class="logo">
            <h2>Delfos Admin</h2>
        </div>
        <nav>
            <ul>
                <li><a routerLink="./dashboard">Dashboard</a></li>
                <li><a routerLink="./header">Header Config</a></li>
                <li><a routerLink="./carousel">Carousel</a></li>
                <li><a routerLink="./about">About Us</a></li>
                <li><a routerLink="./services">Services</a></li>
                <li><a routerLink="./indicators">Indicators</a></li>
                <li><a routerLink="./gallery">Gallery</a></li>
                <li><a routerLink="./testimonials">Testimonials</a></li>
                <li><a routerLink="./news">News/Blog</a></li>
                <li><a routerLink="./pre-footer">Pre-Footer</a></li>
                <li><a routerLink="./footer">Footer Config</a></li>
                <li><a routerLink="/">Back to Site</a></li>
            </ul>
        </nav>
      </aside>
      
      <!-- Mobile Overlay -->
      <div class="sidebar-overlay" [class.open]="isSidebarOpen()" (click)="toggleSidebar()"></div>

      <main class="content">
        <header class="admin-header">
            <button class="mobile-toggle" (click)="toggleSidebar()"><i class="fa-solid fa-bars"></i></button>
            <span>Welcome, Admin</span>
        </header>
        <div class="admin-content-wrapper">
            <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: `
    .admin-container { display: flex; height: 100vh; font-family: 'Roboto', sans-serif; overflow: hidden; }
    .sidebar { width: 250px; background: #2c3e50; color: white; display: flex; flex-direction: column; flex-shrink: 0; }
    .logo { padding: 20px; text-align: center; border-bottom: 1px solid #34495e; }
    .logo h2 { margin: 0; font-family: 'Oswald', sans-serif; color: #F26723; }
    .sidebar nav ul { list-style: none; padding: 0; margin: 0; }
    .sidebar nav ul li a { display: block; padding: 15px 20px; color: #ecf0f1; text-decoration: none; border-bottom: 1px solid #34495e; }
    .sidebar nav ul li a:hover { background: #34495e; transition: background 0.3s; }
    .content { flex: 1; display: flex; flex-direction: column; background: #ecf0f1; overflow: hidden; }
    .admin-header { background: white; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: flex-end; align-items: center; flex-shrink: 0; }
    .mobile-toggle { display: none; background: transparent; border: none; font-size: 2rem; color: #F26723; cursor: pointer; margin-right: auto; padding: 0.5rem; }
    .admin-content-wrapper { padding: 20px; overflow-y: auto; flex: 1; overflow-x: hidden; }
    .sidebar-overlay { display: none; }
    
    @media (max-width: 768px) {
      .sidebar { position: fixed; left: -250px; height: 100vh; z-index: 1000; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 2px 0 10px rgba(0,0,0,0.2); }
      .sidebar.open { left: 0; }
      .sidebar-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 999; display: none; }
      .sidebar-overlay.open { display: block; }
      .mobile-toggle { display: flex; align-items: center; justify-content: center; z-index: 1001; }
      .admin-content-wrapper { padding: 10px; }
    }
  `
})
export class AdminLayout {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
