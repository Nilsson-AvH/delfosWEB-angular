import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-indicators',
  imports: [],
  templateUrl: './indicators.html',
  styleUrl: './indicators.scss',
})
export class Indicators {
  private contentService = inject(ContentService);
  title = this.contentService.indicatorsTitle;
  indicators = this.contentService.indicators;
}
