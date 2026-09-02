import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  private contentService = inject(ContentService);
  title = this.contentService.testimonialsTitle;
  subtitle = this.contentService.testimonialsSubtitle;
  items = this.contentService.testimonials;
}
