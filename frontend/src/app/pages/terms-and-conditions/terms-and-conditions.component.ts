import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SeoService } from '../../services/seo.service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-terms-and-conditions',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './terms-and-conditions.component.html',
    styleUrl: './terms-and-conditions.component.sass'
})
export class TermsAndConditionsComponent implements OnInit {

    constructor(private seoService: SeoService) { }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | Súhlasy");
        this.seoService.setNoIndex();
    }
}
