import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { Indicator } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-indicators-admin',
    imports: [FormsModule],
    template: `
    <div class="admin-page">
      <h2>Manage Indicators</h2>
      
      <!-- Title Section -->
      <div class="section-config">
        <label>Section Title:</label>
        <textarea [ngModel]="contentService.indicatorsTitle()" (ngModelChange)="updateTitle($event)" rows="2" class="title-input"></textarea>
      </div>

      <!-- List View -->
      @if (!isEditing()) {
        <table class="data-table">
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Label</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (item of items(); track item.id) {
                <tr>
                    <td>{{ item.number }}</td>
                    <td>{{ item.label }}</td>
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
            <h3>Edit Indicator</h3>
            <form (ngSubmit)="save()">
                <div class="form-group">
                    <label>Number</label>
                    <input type="number" [(ngModel)]="currentItem().number" name="number" required>
                </div>
                <div class="form-group">
                    <label>Label</label>
                    <input type="text" [(ngModel)]="currentItem().label" name="label" required>
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
    .title-input { width: 100%; max-width: 600px; padding: 8px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
    .data-table th, .data-table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
    .btn-primary { 
      background: var(--Halloween-Orange, #F26723); 
      color: white; 
      padding: 1.2rem 2.4rem; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
      font-size: 1.6rem;
    }
    .btn-primary:hover {
      background: #e05a1d;
    }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 400px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; }
    .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
  `
})
export class IndicatorsAdmin {
    contentService = inject(ContentService);
    items = this.contentService.indicators;

    isEditing = signal(false);
    currentItem = signal<Indicator>({ id: '', number: 0, label: '' });

    updateTitle(val: string) { this.contentService.updateIndicatorsTitle(val); }

    edit(item: Indicator) {
        this.currentItem.set({ ...item });
        this.isEditing.set(true);
    }

    save() {
        const item = this.currentItem();
        if (item.id) {
            this.contentService.updateIndicator(item.id, item);
        }
        this.isEditing.set(false);
    }

    cancel() {
        this.isEditing.set(false);
    }
}
