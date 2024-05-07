import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PlayerRequest } from './player-request';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    add(playerRequest: PlayerRequest): Observable<PlayerRequest> {

        return this.http.post<PlayerRequest>(environment.apiUrl, playerRequest, this.httpOptions);
    }
}
