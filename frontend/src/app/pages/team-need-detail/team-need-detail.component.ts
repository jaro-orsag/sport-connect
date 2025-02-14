import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { DeactivateNeedComponent } from '../../components/need-detail/deactivate-need/deactivate-need.component';
import { DetailPageState } from '../../services/detail-page-state';
import { TeamNeed } from '../../services/team-need';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CongratulationsComponent } from '../../components/need-detail/congratulations/congratulations.component';
import { NeedSummaryComponent } from '../../components/need-detail/need-summary/need-summary.component';
import { DatePipe } from '@angular/common';
import { getDistrictName } from '../../services/district';
import { MarketingConsentComponent } from '../../components/need-detail/marketing-consent/marketing-consent.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-team-need-detail',
  standalone: true,
  imports: [
    DeactivateNeedComponent, 
    CongratulationsComponent, 
    NeedSummaryComponent, 
    MarketingConsentComponent
],
  providers: [DatePipe],
  templateUrl: './team-need-detail.component.html',
  styleUrl: './team-need-detail.component.sass'
})
export class TeamNeedDetailComponent implements OnInit {
    DetailPageState = DetailPageState;
    pageState: DetailPageState = DetailPageState.LOADING;
    teamNeed?: TeamNeed;
    navigatedFromAddition = false;

    constructor(
        private route: ActivatedRoute, 
        private api: ApiService, 
        private datePipe: DatePipe, 
        private snackBar: MatSnackBar,
        private seoService: SeoService,
        private analyticsService: AnalyticsService
    ) { }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | Zhrnutie hľadania hráča");
        this.seoService.setNoIndex();

        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        this.analyticsService.trackTeamNeedViewDetail(uuid);
        this.loadTeamNeed(uuid);
    }

    loadTeamNeed(uuid: string): void {
        this.pageState = DetailPageState.LOADING;
        
        this.api.getTeamNeed(uuid).subscribe(tn => {
            this.teamNeed = tn;

            this.navigatedFromAddition = history.state.navigatedFromAddition;
            this.cleanUpFlagInHistoryState();

            if (this.teamNeed) {
                this.pageState = this.teamNeed.isActive ? DetailPageState.EXISTS_ACTIVE : DetailPageState.EXISTS_NOT_ACTIVE;
            } else {
                this.pageState = DetailPageState.DOES_NOT_EXIST;
            }
        });
    }

    deactivateTeamNeed(): void {
        this.api.deactivateTeamNeed(this.teamNeed!.uuid!).subscribe(_ => {
            this.analyticsService.trackTeamNeedDeactivationFinish(this.teamNeed!.uuid!);
            this.loadTeamNeed(this.teamNeed!.uuid!);
        });
    }

    cleanUpFlagInHistoryState() {
        const newState = { ...history.state };
        delete newState.navigatedFromAddition;
        history.replaceState(newState, '');
    }

    getSummaryItems(): Array<[string, string]> {
        const dateDeactivated: Array<[string, string]> = 
            this.pageState == DetailPageState.EXISTS_NOT_ACTIVE 
                ? [["Ukončené", this.datePipe.transform(this.teamNeed!.dateDeactivated, 'd. L. yyyy o h:mm')!]] 
                : [];

        return [
            ["Okres v ktorom hráme", getDistrictName(this.teamNeed!.districtCode)],
            ["Presná adresa", this.teamNeed!.address || '-'],
            ["Kedy hráme", this.teamNeed!.time],
            ["Meno", this.teamNeed!.playerName],
            ["Email", this.teamNeed!.email],
            ["Telefón", this.teamNeed!.phone || '-'],
            ["O našom tíme", this.teamNeed!.about || '-'],
            ["Vytvorené", this.datePipe.transform(this.teamNeed!.dateAdded, 'd. L. yyyy o h:mm')!],
            ...dateDeactivated
        ];
    }

    revokeMarketingConsent() {
        this.api.updateTeamNeedConsent(this.teamNeed!.uuid!, false).subscribe(_ => {
            this.snackBar.open("Odber bol zrušený", "OK");
            this.loadTeamNeed(this.teamNeed!.uuid!)
        });
    }

    grantMarketingConsent() {
        this.api.updateTeamNeedConsent(this.teamNeed!.uuid!, true).subscribe(_ => {
            this.snackBar.open("Odber bol aktivovaný", "OK");
            this.loadTeamNeed(this.teamNeed!.uuid!)
        });
    }
}
