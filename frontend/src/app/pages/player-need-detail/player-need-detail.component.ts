import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { OnInit } from '@angular/core';
import { PlayerNeed } from '../../services/player-need';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { getDistrictName } from '../../services/district';

@Component({
    selector: 'app-player-need-detail',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule],
    templateUrl: './player-need-detail.component.html',
    styleUrl: './player-need-detail.component.sass'
})
export class PlayerNeedDetailComponent implements OnInit {
    playerNeed?: PlayerNeed;
    navigatedFromPlayerNeedAddition = false;
    loadingFinished = false;

    constructor(private route: ActivatedRoute, private api: ApiService) { }

    ngOnInit() {
        this.getPlayerNeed();
    }

    getPlayerNeed(): void {
        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        this.api.getPlayerNeed(uuid).subscribe(pn => {
            this.playerNeed = pn;

            this.navigatedFromPlayerNeedAddition = history.state.navigatedFromPlayerNeedAddition;
            this.cleanUpFlagInHistoryState();

            this.loadingFinished = true;
        });
    }

    getDistrictNames(): string {
        return this.playerNeed!.districtCodes.map(getDistrictName).join(", ");
    }

    cleanUpFlagInHistoryState() {
        const newState = { ...history.state };
        delete newState.navigatedFromPlayerNeedAddition;
        history.replaceState(newState, '');
    }

    isSummaryInactive() {
        return this.playerNeed && !this.playerNeed.isActive;
    }

    getSummaryTitle(): string {
        if (this.playerNeed && this.playerNeed.isActive) {
            return "Hľadám tím - zhrnutie";
        } 

        if (this.playerNeed && !this.playerNeed.isActive) {
            return "Požiadavka na hľadanie tímu bola zrušená";
        }

        if (this.loadingFinished && !this.playerNeed) {
            return "Požiadavka na hľadanie tímu neexistuje, pravdepodobne máš chybný link";
        }

        return "Načítavam...";
    }
}
