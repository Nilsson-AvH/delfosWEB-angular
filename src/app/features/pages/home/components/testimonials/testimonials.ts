import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Reveal } from '../../../../../shared/directives/reveal';

@Component({
  selector: 'app-testimonials',
  imports: [Icon, Reveal],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  private contentService = inject(ContentService);
  title = this.contentService.testimonialsTitle;
  subtitle = this.contentService.testimonialsSubtitle;
  items = this.contentService.testimonials;
}
