import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { ServiceItem } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

import { SlicePipe } from '@angular/common';

@Component({
    selector: 'app-services-admin',
    imports: [FormsModule, SlicePipe],
    template: `
    <div class="admin-page">
      <h2>Manage Services</h2>
      
      <!-- Title Section -->
      <div class="section-config">
        <label>Section Title:</label>
        <input type="text" [ngModel]="contentService.servicesTitle()" (ngModelChange)="updateTitle($event)">
        <label>Section Subtitle:</label>
        <input type="text" [ngModel]="contentService.servicesSubtitle()" (ngModelChange)="updateSubtitle($event)">
      </div>

      <!-- List View -->
      @if (!isEditing()) {
        <div class="actions">
            <button class="btn-primary" (click)="startNew()">+ Add New Service</button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Icon</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @for (item of items(); track item.id) {
                <tr>
                    <td><i [class]="item.icon"></i></td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.description | slice:0:50 }}...</td>
                    <td>
                        <button class="btn-outline btn-sm" (click)="edit(item)">Editar</button>
                        <button class="btn-danger btn-sm" (click)="delete(item.id!)">Eliminar</button>
                    </td>
                </tr>
                }
            </tbody>
        </table>
      }

      <!-- Edit/Create Form -->
      @if (isEditing()) {
        <div class="edit-form">
            <h3>{{ currentItem().id ? 'Editar Servicio' : 'Nuevo Servicio' }}</h3>
            <form (ngSubmit)="save()">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" [(ngModel)]="currentItem().title" name="title" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea [(ngModel)]="currentItem().description" name="description" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label>Icon Class (FontAwesome)</label>
                    <input type="text" [(ngModel)]="currentItem().icon" name="icon" placeholder="e.g., fa-solid fa-house-lock">
                    <small>Uses FontAwesome classes</small>
                </div>
                <!-- Hidden IconBg for now, default to circle -->
                
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
    .admin-page { padding: 20px; font-family: 'Roboto', sans-serif; }
    h2 { font-family: 'Oswald', sans-serif; color: #2c3e50; }
    .section-config { background: #ecf0f1; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .section-config label { font-weight: 500; margin-right: 10px; }
    .section-config input { padding: 5px; border: 1px solid #bdc3c7; border-radius: 3px; width: 300px; margin-right: 20px; }
    .btn-primary { background: #F26723; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
    .btn-danger { background: var(--Maximun-Red, #e74c3c); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; margin-left:10px; font-family: 'Oswald'; text-transform: uppercase}
    .btn-sm { padding: 5px 10px; font-size: 1rem; margin-right: 5px; cursor: pointer; border-radius: 3px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .data-table th { background-color: #f8f9fa; color: #2c3e50; font-weight: 600; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; color: #34495e; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box; }
    .form-group input:focus, .form-group textarea:focus { border-color: #F26723; outline: none; }
    .actions { margin-bottom: 20px; }
  `
})
export class ServicesAdmin {
    contentService = inject(ContentService);
    items = this.contentService.services;

    isEditing = signal(false);
    currentItem = signal<ServiceItem>({ title: '', description: '', icon: '', iconBg: 'fa-solid fa-circle' });

    updateTitle(val: string) { this.contentService.updateServicesTitle(val); }
    updateSubtitle(val: string) { this.contentService.updateServicesSubtitle(val); }

    startNew() {
        this.currentItem.set({ title: '', description: '', icon: '', iconBg: 'fa-solid fa-circle' });
        this.isEditing.set(true);
    }

    edit(item: ServiceItem) {
        this.currentItem.set({ ...item });
        this.isEditing.set(true);
    }

    save() {
        const item = this.currentItem();
        if (item.id) {
            this.contentService.updateService(item.id, item);
        } else {
            item.id = Date.now().toString();
            this.contentService.addService(item);
        }
        this.isEditing.set(false);
    }

    delete(id: string) {
        if (confirm('Delete this service?')) {
            this.contentService.deleteService(id);
        }
    }

    cancel() {
        this.isEditing.set(false);
    }
}
