import { Component, inject } from '@angular/core';
import { ContentService } from '../../../core/services/content.service';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-floating-button',
  imports: [CommonModule],
  templateUrl: './floating-button.html',
  styleUrl: './floating-button.scss'
})
export class FloatingButton {
  contentService = inject(ContentService);
  scroller = inject(ViewportScroller);
  contactNumber = this.contentService.contactNumber;

  // Extraemos solo digitos del numero de contacto para armar el link de WhatsApp
  get cleanPhone() {
    return this.contactNumber().replace(/\D/g, '');
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
