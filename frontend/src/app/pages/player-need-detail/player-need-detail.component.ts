import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { OnInit } from '@angular/core';
import { PlayerNeed } from '../../services/player-need';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { getDistrictName } from '../../services/district';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DetailPageState } from '../../services/detail-page-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NeedSummaryListItemComponent } from '../../components/need-summary-list-item/need-summary-list-item.component';
import { DeactivateNeedComponent } from '../../components/need-detail/deactivate-need/deactivate-need.component';

@Component({
    selector: 'app-player-need-detail',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, NeedSummaryListItemComponent, DeactivateNeedComponent],
    templateUrl: './player-need-detail.component.html',
    styleUrl: './player-need-detail.component.sass'
})
export class PlayerNeedDetailComponent implements OnInit {
    DetailPageState = DetailPageState;
    pageState: DetailPageState = DetailPageState.LOADING;
    playerNeed?: PlayerNeed;
    navigatedFromPlayerNeedAddition = false;

    constructor(private route: ActivatedRoute, private api: ApiService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.loadPlayerNeed();
    }

    loadPlayerNeed(): void {
        this.pageState = DetailPageState.LOADING;
        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        this.api.getPlayerNeed(uuid).subscribe(pn => {
            this.playerNeed = pn;

            this.navigatedFromPlayerNeedAddition = history.state.navigatedFromPlayerNeedAddition;
            this.cleanUpFlagInHistoryState();

            if (this.playerNeed) {
                this.pageState = this.playerNeed.isActive ? DetailPageState.EXISTS_ACTIVE : DetailPageState.EXISTS_NOT_ACTIVE;
            } else {
                this.pageState = DetailPageState.DOES_NOT_EXIST;
            }
        });
    }

    deactivatePlayerNeed(): void {
        this.api.deactivatePlayerNeed(this.playerNeed!.uuid!).subscribe(_ => this.loadPlayerNeed());
    }

    getDistrictNames(): string {
        return this.playerNeed!.districtCodes.map(getDistrictName).join(", ");
    }

    cleanUpFlagInHistoryState() {
        const newState = { ...history.state };
        delete newState.navigatedFromPlayerNeedAddition;
        history.replaceState(newState, '');
    }

    getSummaryTitle(): string {
        if (this.pageState == DetailPageState.EXISTS_ACTIVE) {
            return "Hľadanie tímu";
        }

        if (this.pageState == DetailPageState.EXISTS_NOT_ACTIVE) {
            return "Hľadanie tímu bolo zrušené";
        }

        if (this.pageState == DetailPageState.DOES_NOT_EXIST) {
            return "Chyba";
        }

        return "Načítavam...";
    }

    revokeMarketingConsent() {
        this.api.updatePlayerNeedConsent(this.playerNeed!.uuid!, false).subscribe(_ => {
            this.snackBar.open("Odber bol zrušený", "OK");
            this.loadPlayerNeed()
        });
    }

    grantMarketingConsent() {
        this.api.updatePlayerNeedConsent(this.playerNeed!.uuid!, true).subscribe(_ => {
            this.snackBar.open("Odber bol aktivovaný", "OK");
            this.loadPlayerNeed()
        });
    }
}
