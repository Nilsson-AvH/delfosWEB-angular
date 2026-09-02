import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';

@Component({
  selector: 'app-pre-footer',
  imports: [],
  templateUrl: './pre-footer.html',
  styleUrl: './pre-footer.scss',
})
export class PreFooter {
  private contentService = inject(ContentService);
  content = this.contentService.preFooter;
}
