import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlayerNeed } from './player-need';
import { Observable } from 'rxjs';
import { TeamNeed } from './team-need';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    addPlayerNeed(playerNeed: PlayerNeed): Observable<PlayerNeed> {
        
        return this.http
            .post<PlayerNeed>(`${environment.apiRoot}/player-needs`, playerNeed, this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    getPlayerNeed(uuid: string): Observable<PlayerNeed> {

        return this.http
            .get<PlayerNeed>(`${environment.apiRoot}/player-needs/${uuid}`, this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    addTeamNeed(teamNeed: TeamNeed): Observable<TeamNeed> {

        return this.http
            .post<TeamNeed>(`${environment.apiRoot}/team-needs`, teamNeed, this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    handleError(error: HttpErrorResponse) {
        let errorDesc;
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('Client or network error occurred:', error.error);
            errorDesc = "client";
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
            errorDesc = error.status;
        }

        const userFriendlyErrorMessage = `Chyba pri komunikácii so serverom (${errorDesc}).`;
        this.snackBar.open(userFriendlyErrorMessage, "OK");

        // Return an observable with a user-facing error message.
        return throwError(() => new Error(userFriendlyErrorMessage));
    }
}
  