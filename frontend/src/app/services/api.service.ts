import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlayerNeed } from './player-need';
import { Observable } from 'rxjs';
import { TeamNeed } from './team-need';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    addPlayerNeed(playerNeed: PlayerNeed): Observable<PlayerNeed> {

        return this.http.post<PlayerNeed>(`${environment.apiRoot}/player-requests`, playerNeed, this.httpOptions);
    }

    addTeamNeed(teamNeed: TeamNeed): Observable<TeamNeed> {

        return this.http.post<TeamNeed>(`${environment.apiRoot}/team-needs`, teamNeed, this.httpOptions);
    }
}
