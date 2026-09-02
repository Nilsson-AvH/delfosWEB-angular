import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { Testimonial } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

import { SlicePipe } from '@angular/common';

@Component({
    selector: 'app-testimonials-admin',
    imports: [FormsModule, SlicePipe],
    template: `
    <div class="admin-page">
      <h2>Manage Testimonials</h2>
      
      <!-- Title Section -->
      <div class="section-config">
        <label>Section Title:</label>
        <input type="text" [ngModel]="contentService.testimonialsTitle()" (ngModelChange)="updateTitle($event)">
        <label>Section Subtitle:</label>
        <input type="text" [ngModel]="contentService.testimonialsSubtitle()" (ngModelChange)="updateSubtitle($event)">
      </div>

      <!-- List View -->
      @if (!isEditing()) {
        <div class="actions">
            <button class="btn-primary" (click)="startNew()">+ Add Testimonial</button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Author</th>
                    <th>Role</th>
                    <th>Text</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (item of items(); track item.id) {
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img [src]="item.authorImage" height="40" style="border-radius: 50%;">
                            {{ item.authorName }}
                        </div>
                    </td>
                    <td>{{ item.authorRole }}</td>
                    <td>{{ item.text | slice:0:50 }}...</td>
                    <td>
                        <button class="btn-sm" (click)="edit(item)">Edit</button>
                        <button class="btn-sm btn-danger" (click)="delete(item.id!)">Delete</button>
                    </td>
                </tr>
                }
            </tbody>
        </table>
      }

      <!-- Edit Form -->
      @if (isEditing()) {
        <div class="edit-form">
            <h3>{{ currentItem().id ? 'Edit Testimonial' : 'New Testimonial' }}</h3>
            <form (ngSubmit)="save()">
                <div class="form-group">
                    <label>Author Name</label>
                    <input type="text" [(ngModel)]="currentItem().authorName" name="authorName" required>
                </div>
                <div class="form-group">
                    <label>Author Role</label>
                    <input type="text" [(ngModel)]="currentItem().authorRole" name="authorRole" required>
                </div>
                <div class="form-group">
                    <label>Author Image URL</label>
                    <input type="text" [(ngModel)]="currentItem().authorImage" name="authorImage" required>
                </div>
                <div class="form-group">
                    <label>Testimonial Text</label>
                    <textarea [(ngModel)]="currentItem().text" name="text" rows="4" required></textarea>
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
    .section-config input { margin-right: 20px; padding: 5px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
    .data-table th, .data-table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
    .btn-primary { background: #F26723; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: var(--Maximun-Red, #e74c3c); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; margin-left:10px; font-family: 'Oswald'; text-transform: uppercase}
    .btn-sm { padding: 5px 10px; font-size: 1rem; cursor: pointer; border-radius: 3px; margin-right: 5px; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
  `
})
export class TestimonialsAdmin {
    contentService = inject(ContentService);
    items = this.contentService.testimonials;

    isEditing = signal(false);
    currentItem = signal<Testimonial>({ text: '', authorName: '', authorRole: '', authorImage: '' });

    updateTitle(val: string) { this.contentService.updateTestimonialsTitle(val); }
    updateSubtitle(val: string) { this.contentService.updateTestimonialsSubtitle(val); }

    startNew() {
        this.currentItem.set({ text: '', authorName: '', authorRole: '', authorImage: '' });
        this.isEditing.set(true);
    }

    edit(item: Testimonial) {
        this.currentItem.set({ ...item });
        this.isEditing.set(true);
    }

    save() {
        const item = this.currentItem();
        if (item.id) {
            this.contentService.updateTestimonial(item.id, item);
        } else {
            item.id = Date.now().toString();
            this.contentService.addTestimonial(item);
        }
        this.isEditing.set(false);
    }

    delete(id: string) {
        if (confirm('Delete this testimonial?')) {
            this.contentService.deleteTestimonial(id);
        }
    }

    cancel() {
        this.isEditing.set(false);
    }
}
