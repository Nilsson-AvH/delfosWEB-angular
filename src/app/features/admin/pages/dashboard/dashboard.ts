import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="dashboard">
        <h1>Dashboard</h1>
        <div class="stats-grid">
            <div class="card">
                <h3>Carousel Slides</h3>
                <p class="number">{{ contentService.slides().length }}</p>
            </div>
            <div class="card">
                <h3>Services</h3>
                <p class="number">{{ contentService.services().length }}</p>
            </div>
            <div class="card">
                <h3>Indicators</h3>
                <p class="number">{{ contentService.indicators().length }}</p>
            </div>
            <div class="card">
                <h3>Gallery Images</h3>
                <p class="number">{{ contentService.galleryItems().length }}</p>
            </div>
            <div class="card">
                <h3>Testimonials</h3>
                <p class="number">{{ contentService.testimonials().length }}</p>
            </div>
            <div class="card">
                <h3>News Items</h3>
                <p class="number">{{ contentService.newsItems().length }}</p>
            </div>
        </div>
    </div>
  `,
  styles: `
    .dashboard { padding: 20px; }
    h1 { font-family: 'Oswald', sans-serif; margin-bottom: 30px; color: #2c3e50; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    .card h3 { margin: 0 0 10px 0; color: #7f8c8d; font-size: 1rem; }
    .card .number { font-size: 2.5rem; font-weight: bold; color: #F26723; margin: 0; font-family: 'Oswald', sans-serif; }
  `
})
export class Dashboard {
  contentService = inject(ContentService);
}
