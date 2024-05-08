import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PlayerNeed } from './player-need';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    add(playerRequest: PlayerNeed): Observable<PlayerNeed> {

        return this.http.post<PlayerNeed>(environment.apiUrl, playerRequest, this.httpOptions);
    }
}
