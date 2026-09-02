import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { ContentLink, FooterAbout } from '../../../../core/models/content.interface';

@Component({
  selector: 'app-footer-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './footer-admin.html',
  styleUrl: './footer-admin.scss',
})
export class FooterAdmin {
  contentService = inject(ContentService);

  // Local binding variable
  footerAboutForm: FooterAbout = { title: '', description: '' };

  // Link manager
  links: ContentLink[] = [];
  editingLinkId: string | null = null;
  newLink: ContentLink = { text: '', type: 'internal', target: '' };

  ngOnInit() {
    this.footerAboutForm = { ...this.contentService.footerAbout() };
    this.links = [...this.contentService.footerMainLinks()];
  }

  saveFooterAbout() {
    this.contentService.updateFooterAbout({ ...this.footerAboutForm });
    alert('Footer information updated successfully');
  }

  // Links CRUD
  editLink(link: ContentLink) {
    this.editingLinkId = link.id as string;
    this.newLink = { ...link };
  }

  saveLink() {
    if (this.editingLinkId) {
      this.contentService.updateFooterMainLink(this.editingLinkId, { ...this.newLink, id: this.editingLinkId });
    } else {
      const id = Date.now().toString(); // simple ID generator
      this.contentService.addFooterMainLink({ ...this.newLink, id });
    }

    // Refresh links from service to sync
    this.links = [...this.contentService.footerMainLinks()];
    this.resetLinkForm();
  }

  deleteLink(id: string) {
    if (confirm('Are you sure you want to delete this footer link?')) {
      this.contentService.deleteFooterMainLink(id);
      this.links = [...this.contentService.footerMainLinks()];
    }
  }

  cancelEdit() {
    this.resetLinkForm();
  }

  private resetLinkForm() {
    this.editingLinkId = null;
    this.newLink = { text: '', type: 'internal', target: '' };
  }
}
