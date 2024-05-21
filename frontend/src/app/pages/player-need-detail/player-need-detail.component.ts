import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-player-need-detail',
  standalone: true,
  imports: [],
  templateUrl: './player-need-detail.component.html',
  styleUrl: './player-need-detail.component.sass'
})
export class PlayerNeedDetailComponent {
    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit() {
        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        console.log("uuid", uuid);

        this.api.getPlayerNeed(uuid).subscribe(pn => console.log("player-need", pn));
    }
}
