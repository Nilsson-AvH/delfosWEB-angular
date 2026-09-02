import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-our-services',
  imports: [],
  templateUrl: './our-services.html',
  styleUrl: './our-services.scss',
})
export class OurServices {
  private contentService = inject(ContentService);
  title = this.contentService.servicesTitle;
  subtitle = this.contentService.servicesSubtitle;
  services = this.contentService.services;
}
