import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { NewsItem } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-news-admin',
    imports: [FormsModule],
    template: `
    <div class="admin-page">
      <h2>Manage News</h2>
      
      <!-- Title Section -->
      <div class="section-config">
        <label>Section Title:</label>
        <input type="text" [ngModel]="contentService.newsTitle()" (ngModelChange)="updateTitle($event)">
        <label>Section Subtitle:</label>
        <input type="text" [ngModel]="contentService.newsSubtitle()" (ngModelChange)="updateSubtitle($event)">
      </div>

      <!-- List View -->
      @if (!isEditing()) {
        <div class="actions">
            <button class="btn-primary" (click)="startNew()">+ Add News Item</button>
        </div>
        <div class="news-grid">
            @for (item of items(); track item.id) {
            <div class="news-item">
                <img [src]="item.imageUrl" height="100">
                <div class="content">
                    <h4>{{ item.title }}</h4>
                    <div class="item-actions">
                        <button class="btn-outline btn-sm" (click)="edit(item)">Editar</button>
                        <button class="btn-danger btn-sm" (click)="delete(item.id!)">Eliminar</button>
                    </div>
                </div>
            </div>
            }
        </div>
      }

      <!-- Edit Form -->
      @if (isEditing()) {
        <div class="edit-form">
            <h3>{{ currentItem().id ? 'Editar Noticia' : 'Crear Noticia' }}</h3>
            <form (ngSubmit)="save()">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" [(ngModel)]="currentItem().title" name="title" required>
                </div>
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" [(ngModel)]="currentItem().imageUrl" name="imageUrl" required>
                </div>
                <div class="form-group">
                    <label>Link URL (Redirección Externa Clásica)</label>
                    <input type="text" [(ngModel)]="currentItem().linkUrl" name="linkUrl">
                </div>
                <div class="form-group">
                    <label>Iframe URL (Noticia Embebida)</label>
                    <input type="text" [(ngModel)]="currentItem().iframeUrl" name="iframeUrl">
                </div>
                <div class="form-group">
                    <label>Description (Noticia en Texto)</label>
                    <textarea [(ngModel)]="currentItem().description" name="description" rows="5" placeholder="Si se usa, Iframe URL debe estar vacío."></textarea>
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
    .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .news-item { border: 1px solid #ddd; border-radius: 4px; background: white; overflow: hidden; }
    .news-item img { width: 100%; height: 150px; object-fit: cover; }
    .content { padding: 10px; }
    .item-actions { margin-top: 10px; }
    .btn-primary { background: #F26723; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: var(--Maximun-Red, #e74c3c); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; margin-left:10px; font-family: 'Oswald'; text-transform: uppercase}
    .btn-sm { padding: 5px 10px; font-size: 1rem; cursor: pointer; border: none; border-radius: 3px; margin-right: 5px; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .form-group textarea { resize: vertical; }
  `
})
export class NewsAdmin {
    contentService = inject(ContentService);
    items = this.contentService.newsItems;

    isEditing = signal(false);
    currentItem = signal<NewsItem>({ title: '', imageUrl: '', linkUrl: '', iframeUrl: '', description: '' });

    updateTitle(val: string) { this.contentService.updateNewsTitle(val); }
    updateSubtitle(val: string) { this.contentService.updateNewsSubtitle(val); }

    startNew() {
        this.currentItem.set({ title: '', imageUrl: '', linkUrl: '', iframeUrl: '', description: '' });
        this.isEditing.set(true);
    }

    edit(item: NewsItem) {
        this.currentItem.set({ ...item });
        this.isEditing.set(true);
    }

    save() {
        const item = this.currentItem();
        if (item.id) {
            this.contentService.updateNewsItem(item.id, item);
        } else {
            item.id = Date.now().toString();
            this.contentService.addNewsItem(item);
        }
        this.isEditing.set(false);
    }

    delete(id: string) {
        if (confirm('Delete this news item?')) {
            this.contentService.deleteNewsItem(id);
        }
    }

    cancel() {
        this.isEditing.set(false);
    }
}
