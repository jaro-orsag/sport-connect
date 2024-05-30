import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { OnInit } from '@angular/core';
import { PlayerNeed } from '../../services/player-need';
import { getDistrictName } from '../../services/district';
import { DetailPageState } from '../../services/detail-page-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeactivateNeedComponent } from '../../components/need-detail/deactivate-need/deactivate-need.component';
import { CongratulationsComponent } from '../../components/need-detail/congratulations/congratulations.component';
import { NeedSummaryComponent } from '../../components/need-detail/need-summary/need-summary.component';
import { DatePipe } from '@angular/common';
import { MarketingConsentComponent } from '../../components/need-detail/marketing-consent/marketing-consent.component';
import { SeoService } from '../../services/seo.service';

@Component({
    selector: 'app-player-need-detail',
    standalone: true,
    imports: [ 
        DeactivateNeedComponent, 
        CongratulationsComponent, 
        NeedSummaryComponent, 
        MarketingConsentComponent
    ],
    providers: [DatePipe],
    templateUrl: './player-need-detail.component.html',
    styleUrl: './player-need-detail.component.sass'
})
export class PlayerNeedDetailComponent implements OnInit {
    DetailPageState = DetailPageState;
    pageState: DetailPageState = DetailPageState.LOADING;
    playerNeed?: PlayerNeed;
    navigatedFromAddition = false;

    constructor(
        private route: ActivatedRoute, 
        private api: ApiService, 
        private snackBar: MatSnackBar, 
        private datePipe: DatePipe,
        private seoService: SeoService
    ) { }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | Zhrnutie hľadania tímu");
        this.seoService.setNoIndex();

        this.loadPlayerNeed();
    }

    loadPlayerNeed(): void {
        this.pageState = DetailPageState.LOADING;
        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        this.api.getPlayerNeed(uuid).subscribe(pn => {
            this.playerNeed = pn;

            this.navigatedFromAddition = history.state.navigatedFromAddition;
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
        delete newState.navigatedFromAddition;
        history.replaceState(newState, '');
    }

    getSummaryItems(): Array<[string, string]> {
        const dateDeactivated: Array<[string, string]> = 
            this.pageState == DetailPageState.EXISTS_NOT_ACTIVE 
                ? [["Ukončené", this.datePipe.transform(this.playerNeed!.dateDeactivated, 'd. L. yyyy o h:mm')!]] 
                : [];

        return [
            ["Meno", this.playerNeed!.playerName],
            ["Okresy kde chcem hrať", this.getDistrictNames()],
            ["Kedy chcem hrať", this.playerNeed!.availability],
            ["Email", this.playerNeed!.email],
            ["Telefón", this.playerNeed!.phone || '-'],
            ["O mne", this.playerNeed!.about || '-'],
            ["Vytvorené", this.datePipe.transform(this.playerNeed!.dateAdded, 'd. L. yyyy o h:mm')!],
            ...dateDeactivated
        ];
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
