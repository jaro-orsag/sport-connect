import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SeoService } from '../../services/seo.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.sass'
})
export class AboutUsComponent implements OnInit {

    constructor(private seoService: SeoService) { }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | O nás");
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Zisti, čo je našim cieľom a poslaním. Spoznaj autora projektu. A neváhaj nás kontaktovať.' }
        ]);
    }
}
