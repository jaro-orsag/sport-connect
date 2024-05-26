import { Component } from '@angular/core';
import { DeactivateNeedComponent } from '../../components/need-detail/deactivate-need/deactivate-need.component';
import { DetailPageState } from '../../services/detail-page-state';
import { TeamNeed } from '../../services/team-need';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-need-detail',
  standalone: true,
  imports: [DeactivateNeedComponent],
  templateUrl: './team-need-detail.component.html',
  styleUrl: './team-need-detail.component.sass'
})
export class TeamNeedDetailComponent {
    DetailPageState = DetailPageState;
    pageState: DetailPageState = DetailPageState.LOADING;
    teamNeed?: TeamNeed;
    navigatedFromTeamNeedAddition = false;

    constructor(private route: ActivatedRoute, private api: ApiService) { }

    ngOnInit() {
        this.loadTeamNeed();
    }

    loadTeamNeed(): void {
        this.pageState = DetailPageState.LOADING;
        const uuid = this.route.snapshot.paramMap.get('uuid')!;
        this.api.getTeamNeed(uuid).subscribe(tn => {
            this.teamNeed = tn;

            this.navigatedFromTeamNeedAddition = history.state.navigatedFromTeamNeedAddition;
            this.cleanUpFlagInHistoryState();

            if (this.teamNeed) {
                this.pageState = this.teamNeed.isActive ? DetailPageState.EXISTS_ACTIVE : DetailPageState.EXISTS_NOT_ACTIVE;
            } else {
                this.pageState = DetailPageState.DOES_NOT_EXIST;
            }
            console.log("teamNeed", this.teamNeed);
        });
    }

    deactivatePlayerNeed(): void {
        this.api.deactivatePlayerNeed(this.teamNeed!.uuid!).subscribe(_ => this.loadTeamNeed());
    }

    cleanUpFlagInHistoryState() {
        const newState = { ...history.state };
        delete newState.navigatedFromPlayerNeedAddition;
        history.replaceState(newState, '');
    }
}
