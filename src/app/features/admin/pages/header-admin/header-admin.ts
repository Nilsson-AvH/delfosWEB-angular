import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../../core/services/content.service';
import { ContactInfo, ActionButton, ContentLink, LinkType } from '../../../../core/models/content.interface';

@Component({
  selector: 'app-header-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.scss',
})
export class HeaderAdmin {
  contentService = inject(ContentService);

  // Local binding variables para no mutar los signals directamente
  contactNumberForm: string = '';
  utilsTitleForm: string = '';

  // Link manager
  links: ContentLink[] = [];
  editingLinkId: string | null = null;
  newLink: ContentLink = { text: '', type: 'internal', target: '' };

  // Utils link manager
  utilsLinks: ContentLink[] = [];
  editingUtilsLinkId: string | null = null;
  newUtilsLink: ContentLink = { text: '', type: 'external', target: '' };

  ngOnInit() {
    this.contactNumberForm = this.contentService.contactNumber();
    this.utilsTitleForm = this.contentService.utilsTitle();
    this.links = [...this.contentService.headerLinks()];
    this.utilsLinks = [...this.contentService.utilsLinks()];
  }

  saveContactNumber() {
    this.contentService.updateContactNumber(this.contactNumberForm);
    alert('Contact number updated successfully');
  }

  saveUtilsTitle() {
    this.contentService.updateUtilsTitle(this.utilsTitleForm);
    alert('Utils Title updated successfully');
  }

  // Links CRUD
  editLink(link: ContentLink) {
    this.editingLinkId = link.id as string;
    this.newLink = { ...link };
  }

  saveLink() {
    if (this.editingLinkId) {
      this.contentService.updateHeaderLink(this.editingLinkId, { ...this.newLink, id: this.editingLinkId });
    } else {
      const id = Date.now().toString(); // simple ID generator
      this.contentService.addHeaderLink({ ...this.newLink, id });
    }

    // Refresh links from service to sync
    this.links = [...this.contentService.headerLinks()];
    this.resetLinkForm();
  }

  deleteLink(id: string) {
    if (confirm('Are you sure you want to delete this link?')) {
      this.contentService.deleteHeaderLink(id);
      this.links = [...this.contentService.headerLinks()];
    }
  }

  cancelEdit() {
    this.resetLinkForm();
  }

  private resetLinkForm() {
    this.editingLinkId = null;
    this.newLink = { text: '', type: 'internal', target: '' };
  }

  // Utils Links CRUD
  editUtilsLink(link: ContentLink) {
    this.editingUtilsLinkId = link.id as string;
    this.newUtilsLink = { ...link };
  }

  saveUtilsLink() {
    if (this.editingUtilsLinkId) {
      this.contentService.updateUtilsLink(this.editingUtilsLinkId, { ...this.newUtilsLink, id: this.editingUtilsLinkId });
    } else {
      const id = Date.now().toString(); // simple ID generator
      this.contentService.addUtilsLink({ ...this.newUtilsLink, id });
    }

    // Refresh links from service to sync
    this.utilsLinks = [...this.contentService.utilsLinks()];
    this.resetUtilsLinkForm();
  }

  deleteUtilsLink(id: string) {
    if (confirm('Are you sure you want to delete this link?')) {
      this.contentService.deleteUtilsLink(id);
      this.utilsLinks = [...this.contentService.utilsLinks()];
    }
  }

  cancelUtilsEdit() {
    this.resetUtilsLinkForm();
  }

  private resetUtilsLinkForm() {
    this.editingUtilsLinkId = null;
    this.newUtilsLink = { text: '', type: 'external', target: '' };
  }
}
