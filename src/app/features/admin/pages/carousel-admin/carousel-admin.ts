import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { Slide } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carousel-admin',
  imports: [FormsModule],
  template: `
    <div class="carousel-admin">
      <h2>Manage Carousel Slides</h2>
      
      <!-- List View -->
      @if (!isEditing()) {
        <div class="actions">
            <button class="btn-primary" (click)="startNewSlide()">+ Add New Slide</button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (slide of slides(); track slide.id) {
                <tr>
                    <td><img [src]="slide.imageDesktop" alt="Thumb" class="thumb"></td>
                    <td>{{ slide.title }}</td>
                    <td>
                        <button class="btn-outline btn-sm" (click)="editSlide(slide)">Editar</button>
                        <button class="btn-danger btn-sm" (click)="deleteSlide(slide.id!)">Eliminar</button>
                    </td>
                </tr>
                }
            </tbody>
        </table>
      }

      <!-- Edit/Create Form -->
      @if (isEditing()) {
        <div class="edit-form">
            <h3>{{ currentSlide().id ? 'Edit Slide' : 'New Slide' }}</h3>
            <form (ngSubmit)="saveSlide()">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" [(ngModel)]="currentSlide().title" name="title" required>
                </div>
                <div class="form-group">
                    <label>Text</label>
                    <textarea [(ngModel)]="currentSlide().text" name="text" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label>Image Desktop URL</label>
                    <input type="text" [(ngModel)]="currentSlide().imageDesktop" name="imageDesktop">
                </div>
                <div class="form-group">
                    <label>Image Mobile URL</label>
                    <input type="text" [(ngModel)]="currentSlide().imageMobile" name="imageMobile">
                </div>
                <div class="form-group">
                    <label>Link Text</label>
                    <input type="text" [(ngModel)]="currentSlide().linkText" name="linkText">
                </div>
                <div class="form-group">
                    <label>Link URL</label>
                    <input type="text" [(ngModel)]="currentSlide().linkUrl" name="linkUrl">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Aceptar</button>
                    <button type="button" class="btn-outline" (click)="cancelEdit()">Cancelar</button>
                </div>
            </form>
        </div>
      }
    </div>
  `,
  styles: `
    .carousel-admin { padding: 20px; font-family: 'Roboto', sans-serif; }
    h2 { font-family: 'Oswald', sans-serif; color: #2c3e50; }
    .btn-primary { background: #F26723; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
    .btn-danger { background: var(--Maximun-Red, #e74c3c); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; margin-left:10px; font-family: 'Oswald'; text-transform: uppercase}
    .btn-sm { padding: 5px 10px; font-size: 1rem; margin-right: 5px; cursor: pointer; border-radius: 3px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .data-table th { background-color: #f8f9fa; color: #2c3e50; font-weight: 600; }
    .thumb { height: 40px; object-fit: cover; border-radius: 4px; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; color: #34495e; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box; }
    .form-group input:focus, .form-group textarea:focus { border-color: #F26723; outline: none; }
    .actions { margin-bottom: 20px; }
  `
})
export class CarouselAdmin {
  contentService = inject(ContentService);
  slides = this.contentService.slides;

  isEditing = signal(false);
  currentSlide = signal<Slide>({ title: '', text: '', imageDesktop: '', imageMobile: '', linkText: '', linkUrl: '' });

  startNewSlide() {
    this.currentSlide.set({ title: '', text: '', imageDesktop: '', imageMobile: '', linkText: '', linkUrl: '' });
    this.isEditing.set(true);
  }

  editSlide(slide: Slide) {
    // Clone object to avoid direct mutation before save
    this.currentSlide.set({ ...slide });
    this.isEditing.set(true);
  }

  saveSlide() {
    const slide = this.currentSlide();
    if (slide.id) {
      this.contentService.updateSlide(slide.id, slide);
    } else {
      // Generate pseudo ID
      slide.id = Date.now().toString();
      this.contentService.addSlide(slide);
    }
    this.isEditing.set(false);
  }

  deleteSlide(id: string) {
    if (confirm('Are you sure you want to delete this slide?')) {
      this.contentService.deleteSlide(id);
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
  }
}
