import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { AboutUsItem } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-about-admin',
    imports: [FormsModule],
    template: `
    <div class="admin-page">
      <h2>Manage About Us</h2>
      
      <!-- Title Section -->
      <div class="section-config">
        <label>Section Title:</label>
        <input type="text" [ngModel]="contentService.aboutUsTitle()" (ngModelChange)="updateTitle($event)" class="title-input">
      </div>

      <!-- List View -->
      @if (!isEditing()) {
        <table class="data-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (item of items(); track item.id) {
                <tr>
                    <td><img [src]="item.imageUrl" height="50"></td>
                    <td>{{ item.title }}</td>
                    <td>
                        <button class="btn-sm" (click)="edit(item)">Edit</button>
                    </td>
                </tr>
                }
            </tbody>
        </table>
      }

      <!-- Edit Form -->
      @if (isEditing()) {
        <div class="edit-form">
            <h3>Edit About Us Item</h3>
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
                    <label>Description (Modal Content)</label>
                    <textarea [(ngModel)]="currentItem().description" name="description" rows="4"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save</button>
                    <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
                </div>
            </form>
        </div>
      }
    </div>
  `,
    styles: `
    .admin-page { padding: 20px; }
    .section-config { background: #ecf0f1; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .title-input { width: 100%; max-width: 500px; padding: 8px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
    .data-table th, .data-table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
    .btn-primary { background: #F26723; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-secondary { background: #95a5a6; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin-left: 10px; cursor: pointer; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .form-group textarea { resize: vertical; }
  `
})
export class AboutAdmin {
    contentService = inject(ContentService);
    items = this.contentService.aboutUsItems;

    isEditing = signal(false);
    currentItem = signal<AboutUsItem>({ id: '', title: '', imageUrl: '', description: '' });

    updateTitle(val: string) { this.contentService.updateAboutUsTitle(val); }

    edit(item: AboutUsItem) {
        this.currentItem.set({ ...item });
        this.isEditing.set(true);
    }

    save() {
        const item = this.currentItem();
        if (item.id) {
            this.contentService.updateAboutUsItem(item.id, item);
        }
        this.isEditing.set(false);
    }

    cancel() {
        this.isEditing.set(false);
    }
}
