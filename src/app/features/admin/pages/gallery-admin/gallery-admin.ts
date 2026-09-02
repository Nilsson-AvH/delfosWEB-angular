import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { GalleryItem } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-gallery-admin',
    imports: [FormsModule],
    template: `
    <div class="admin-page">
      <h2>Manage Gallery</h2>
      
      <!-- Title Section -->
      <div class="section-config">
        <label>Section Title:</label>
        <input type="text" [ngModel]="contentService.galleryTitle()" (ngModelChange)="updateTitle($event)">
        <label>Section Subtitle:</label>
        <input type="text" [ngModel]="contentService.gallerySubtitle()" (ngModelChange)="updateSubtitle($event)">
      </div>

      <!-- List View -->
      @if (!isEditing()) {
        <div class="actions">
            <button class="btn-primary" (click)="startNew()">+ Add New Image</button>
        </div>
        <div class="gallery-grid">
            @for (item of items(); track item.id) {
            <div class="gallery-item">
                <img [src]="item.imageUrl" [alt]="item.alt">
                <div class="item-actions">
                    <button class="btn-outline btn-sm" (click)="edit(item)">Editar</button>
                    <button class="btn-danger btn-sm" (click)="delete(item.id!)">Eliminar</button>
                </div>
            </div>
            }
        </div>
      }

      <!-- Edit Form -->
      @if (isEditing()) {
        <div class="edit-form">
            <h3>{{ currentItem().id ? 'Editar Imagen' : 'Nueva Imagen' }}</h3>
            <form (ngSubmit)="save()">
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" [(ngModel)]="currentItem().imageUrl" name="imageUrl" required>
                </div>
                <div class="form-group">
                    <label>Alt Text</label>
                    <input type="text" [(ngModel)]="currentItem().alt" name="alt" required>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Aceptar</button>
                    <button type="button" class="btn-outline" (click)="cancel()">Cancelar</button>
                </div>
            </form>
        </div>
      }
    </div>
  `,
    styles: `
    .admin-page { padding: 20px; }
    .section-config { background: #ecf0f1; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .section-config input { margin-right: 20px; padding: 5px; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .gallery-item { border: 1px solid #ddd; padding: 10px; border-radius: 4px; background: white; text-align: center; }
    .gallery-item img { max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }
    .item-actions { margin-top: 10px; display: flex; justify-content: center; gap: 5px; }
    .btn-primary { background: #F26723; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: var(--Maximun-Red, #e74c3c); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; margin-left:10px; font-family: 'Oswald'; text-transform: uppercase}
    .btn-sm { padding: 5px 10px; font-size: 1rem; cursor: pointer; border-radius: 3px; margin-right: 5px; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 400px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; text-align: left; }
    .form-group label { display: block; margin-bottom: 5px; }
    .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
  `
})
export class GalleryAdmin {
    contentService = inject(ContentService);
    items = this.contentService.galleryItems;

    isEditing = signal(false);
    currentItem = signal<GalleryItem>({ imageUrl: '', alt: '' });

    updateTitle(val: string) { this.contentService.updateGalleryTitle(val); }
    updateSubtitle(val: string) { this.contentService.updateGallerySubtitle(val); }

    startNew() {
        this.currentItem.set({ imageUrl: '', alt: '' });
        this.isEditing.set(true);
    }

    edit(item: GalleryItem) {
        this.currentItem.set({ ...item });
        this.isEditing.set(true);
    }

    save() {
        const item = this.currentItem();
        if (item.id) {
            this.contentService.updateGalleryItem(item.id, item);
        } else {
            item.id = Date.now().toString();
            this.contentService.addGalleryItem(item);
        }
        this.isEditing.set(false);
    }

    delete(id: string) {
        if (confirm('Delete this image?')) {
            this.contentService.deleteGalleryItem(id);
        }
    }

    cancel() {
        this.isEditing.set(false);
    }
}
