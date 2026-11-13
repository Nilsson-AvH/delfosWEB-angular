import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Reveal } from '../../../../../shared/directives/reveal';

@Component({
  selector: 'app-pre-footer',
  imports: [Icon, Reveal],
  templateUrl: './pre-footer.html',
  styleUrl: './pre-footer.scss',
})
export class PreFooter {
  private contentService = inject(ContentService);
  content = this.contentService.preFooter;
}
