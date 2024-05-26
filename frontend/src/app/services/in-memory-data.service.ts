import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions, STATUS, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

    SHOULD_RESPOND_404_ON_PATCH = false;
    SHOULD_RESPOND_500_ON_PATCH = false;

    SHOULD_RESPOND_404_ON_GET = false;
    SHOULD_RESPOND_500_ON_GET = false;

    SHOULD_RESPOND_404_ON_POST = false;
    SHOULD_RESPOND_500_ON_POST = false;

    PLAYER_NEED = { 
        "id": 1, 
        "uuid": "5f444def-1529-4705-9a9e-a59f66c1cc1e", 
        "isActive": true,
        "dateDeactivated": "2024-05-25T11:05:40+02:00", 
        "playerName": "Jaroslav Ors\u00e1g", 
        "availability": "Môžem každý druhý utorok o 16:00. Alebo každú stredu na obed.", 
        "email": "jorsag@gmail.com", 
        "phone": "+421917777614", 
        "about": "Mám 20 rokov a futbal hrávam od ôsmych rokov. Hral som aj profesionálne za Slovan BA. Určite si budeme rozumieť.", 
        "dateAdded": "2024-05-22T11:00:37+02:00", 
        "districtCodes": [301, 302, 303],
        "isMarketingConsentGranted": true,
        "dateMarketingConsentChanged": "2024-05-22T11:00:37+02:00",
    };

    TEAM_NEED = {
        "id": 2,
        "uuid": "72c63f2c-6b02-4854-affd-7a41c3bae6de",
        "isActive": true,
        "dateDeactivated": "2024-05-26T11:10:40+02:00", 
        "districtCode": 301,
        "address": "Svatoplukova 47, Bratislava",
        "time": "Hráme každú stredu utorok o 16:00. Alebo každú stredu na obed.", 
        "playerName": "Jaroslav Ors\u00e1g", 
        "email": "jorsag@gmail.com", 
        "phone": "+421917777614", 
        "about": "Vsetci sme profici, vacsinou veterani z FC Barcelona a Real Madrid.", 
        "isMarketingConsentGranted": true,
        "dateMarketingConsentChanged": "2024-05-22T11:00:37+02:00",
        "dateAdded": "2024-05-22T11:00:37+02:00"
    };

    createDb() {
        return { "player-needs": [this.PLAYER_NEED], "team-needs": [this.TEAM_NEED] };
    }

    get(requestInfo: RequestInfo): Observable<Response | null> { 
        return this.handleAllMethods(requestInfo);
    }

    post(requestInfo: RequestInfo): Observable<Response | null> { 
        return this.handleAllMethods(requestInfo);
    }

    patch(requestInfo: RequestInfo): Observable<Response | null> { 
        return this.handleAllMethods(requestInfo);
    }

    private handleAllMethods(requestInfo: RequestInfo): Observable<Response | null> {
        const method = requestInfo.method;

        if (method == "get" && this.SHOULD_RESPOND_404_ON_GET) {
            return this.respond404(requestInfo);
        }

        if (method == "get" && this.SHOULD_RESPOND_500_ON_GET) {
            return this.respond500(requestInfo);
        }

        if (method == "post" && this.SHOULD_RESPOND_404_ON_POST) {
            return this.respond404(requestInfo);
        }

        if (method == "post" && this.SHOULD_RESPOND_500_ON_POST) {
            return this.respond500(requestInfo);
        }

        if (method == "patch" && this.SHOULD_RESPOND_404_ON_PATCH) {
            return this.respond404(requestInfo);
        }

        if (method == "patch" && this.SHOULD_RESPOND_500_ON_PATCH) {
            return this.respond500(requestInfo);
        }

        return this.respond200(requestInfo); 
    }

    private respond200(requestInfo: RequestInfo): Observable<Response | null> {
        return this.respond(requestInfo, STATUS.OK);
    }

    private respond204(requestInfo: RequestInfo): Observable<null> {
        return this.respond(requestInfo, STATUS.NO_CONTENT) as Observable<null>;
    }

    private respond404(requestInfo: RequestInfo): Observable<Response | null> {
        return this.respond(requestInfo, STATUS.NOT_FOUND);
    }

    private respond500(requestInfo: RequestInfo): Observable<Response | null> {
        return this.respond(requestInfo, STATUS.INTERNAL_SERVER_ERROR);
    }

    private respond(requestInfo: RequestInfo, status: number): Observable<Response | null> {

        return requestInfo.utils.createResponse$(() => {
            const {headers, url} = requestInfo;

            let body;
            if (status !== 200) {
                body = {};
            } else if (requestInfo.collectionName == "player-needs") {
                body = { body: this.PLAYER_NEED };
            } else if (requestInfo.collectionName == "team-needs") {
                body = { body: this.TEAM_NEED };
            } else {
                throw new Error("unsupported collection " + requestInfo.collectionName);
            }

            const options: ResponseOptions = {
                ...body,
                status, 
                headers, 
                url 
            };

            return options;
          });
    }
}
