import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { PreFooterContent } from '../../../../core/models/content.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-pre-footer-admin',
    imports: [FormsModule],
    template: `
    <div class="admin-page">
      <h2>Manage Pre-Footer (Download)</h2>
      
      <div class="edit-form">
          <form (ngSubmit)="save()">
              <div class="form-group">
                  <label>Text Content</label>
                  <input type="text" [(ngModel)]="content.text" name="text" required>
              </div>
              <div class="form-group">
                  <label>Button Text</label>
                  <input type="text" [(ngModel)]="content.pdfButtonText" name="pdfButtonText" required>
              </div>
              <div class="form-group">
                  <label>PDF URL</label>
                  <input type="text" [(ngModel)]="content.pdfUrl" name="pdfUrl" required>
              </div>
              
              <div class="form-actions">
                  <button type="submit" class="btn-primary">Save Changes</button>
              </div>
          </form>
      </div>
    </div>
  `,
    styles: `
    .admin-page { padding: 20px; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
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
        width: 100%;
    }
    .btn-primary:active, .btn-primary:focus, .btn-primary:hover {
        background: #e05a1d;
    }
  `
})
export class PreFooterAdmin {
    contentService = inject(ContentService);
    // We clone the content to avoid direct mutation until save, although signals are reactive,
    // for form binding it's safer to have a local copy or bind directly if we want immediate updates.
    // Here we'll bind a local object and update on save for clarity.
    content: PreFooterContent = { ...this.contentService.preFooter() };

    save() {
        this.contentService.updatePreFooter(this.content);
        alert('Pre-Footer settings saved!');
    }
}
