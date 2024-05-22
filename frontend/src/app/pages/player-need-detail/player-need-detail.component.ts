import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { OnInit } from '@angular/core';
import { PlayerNeed } from '../../services/player-need';
@Component({
  selector: 'app-player-need-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-need-detail.component.html',
  styleUrl: './player-need-detail.component.sass'
})
export class PlayerNeedDetailComponent implements OnInit {
    playerNeed?: PlayerNeed;

    constructor(private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit() {
        this.getPlayerNeed()
    }

    getPlayerNeed(): void {
        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        console.log("uuid", uuid);
        this.api.getPlayerNeed(uuid).subscribe(pn => this.playerNeed = pn);
    }
}
