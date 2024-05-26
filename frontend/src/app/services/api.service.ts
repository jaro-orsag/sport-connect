import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlayerNeed } from './player-need';
import { Observable } from 'rxjs';
import { TeamNeed } from './team-need';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { of } from 'rxjs';

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

    getPlayerNeed(uuid: string): Observable<PlayerNeed | undefined> {

        return this.http
            .get<PlayerNeed | undefined>(`${environment.apiRoot}/player-needs/${uuid}`, this.httpOptions)
            .pipe(catchError(this.handleErrorForGet.bind(this)));
    }

    deactivatePlayerNeed(uuid: string): Observable<null> {

        return this.http
            .patch<null>(`${environment.apiRoot}/player-needs/${uuid}/deactivate`, this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    updatePlayerNeedConsent(uuid: string, grant: boolean): Observable<null> {

        return this.http
            .patch<null>(`${environment.apiRoot}/player-needs/${uuid}/marketing-consent`, this.getConsentAction(grant), this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    addTeamNeed(teamNeed: TeamNeed): Observable<TeamNeed> {

        return this.http
            .post<TeamNeed>(`${environment.apiRoot}/team-needs`, teamNeed, this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    getTeamNeed(uuid: string): Observable<TeamNeed | undefined> {

        return this.http
            .get<TeamNeed | undefined>(`${environment.apiRoot}/team-needs/${uuid}`, this.httpOptions)
            .pipe(catchError(this.handleErrorForGet.bind(this)));
    }

    deactivateTeamNeed(uuid: string): Observable<null> {

        return this.http
            .patch<null>(`${environment.apiRoot}/team-needs/${uuid}/deactivate`, this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    updateTeamNeedConsent(uuid: string, grant: boolean): Observable<null> {

        return this.http
            .patch<null>(`${environment.apiRoot}/team-needs/${uuid}/marketing-consent`, this.getConsentAction(grant), this.httpOptions)
            .pipe(catchError(this.handleError.bind(this)));
    }

    private getConsentAction(grant: boolean) {
        return {
            "action": grant ? "grant" : "revoke"
        };
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

    handleErrorForGet(error: HttpErrorResponse) {
        if (error.status === 404) {

            return of(undefined);;
        }

        return this.handleError(error);
    }
}