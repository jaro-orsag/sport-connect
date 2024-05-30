import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.sass'
})
export class PageNotFoundComponent implements OnInit {

    constructor(private seoService: SeoService) { }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | Chyba");
        this.seoService.setNoIndex();
    }
}
