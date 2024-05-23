import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions, STATUS, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

    SERVE_COMPLETE_ENTITIES = true;

    SHOULD_RESPOND_404_ON_GET = false;
    SHOULD_RESPOND_500_ON_GET = false;

    SHOULD_RESPOND_404_ON_POST = false;
    SHOULD_RESPOND_500_ON_POST = false;

    completePlayerNeed = { 
        "id": 1, 
        "uuid": "5f444def-1529-4705-9a9e-a59f66c1cc1e", 
        "isActive": true,
        "playerName": "Jaroslav Ors\u00e1g", 
        "availability": "Môžem každý druhý utorok o 16:00. Alebo každú stredu na obed.", 
        "email": "jorsag@gmail.com", 
        "phone": "+421917777614", 
        "about": "Mám 20 rokov a futbal hrávam od ôsmych rokov. Hral som aj profesionálne za Slovan BA. Určite si budeme rozumieť.", 
        "dateAdded": "2024-05-22T11:00:37+02:00", 
        "districtCodes": [301, 302, 303], 
        "consentIds": [1, 2, 3, 4] 
    };

    incompletePlayerNeed = {
        "id": 2,
        "uuid": "72c63f2c-6b02-4854-affd-7a41c3bae6de",
        "isActive": false,
        "playerName": "Jaroslav Ors\u00e1g", 
        "availability": "Môžem každý druhý utorok o 16:00. Alebo každú stredu na obed.", 
        "email": "jorsag@gmail.com", 
        "about": "", 
        "dateAdded": "2024-05-22T11:00:37+02:00", 
        "districtCodes": [301, 302, 303], 
        "consentIds": [1, 2, 3, 4] 
    };

    createDb() {
        const playerNeeds = [this.completePlayerNeed, this.incompletePlayerNeed];
        return { "player-needs": playerNeeds, "team-needs": playerNeeds };
    }

    get(requestInfo: RequestInfo): Observable<Response> { 
        if (this.SHOULD_RESPOND_404_ON_GET) {
            return this.respond404(requestInfo);
        }

        if (this.SHOULD_RESPOND_500_ON_GET) {
            return this.respond500(requestInfo);
        }

        return this.respond200(requestInfo); 
    }

    post(requestInfo: RequestInfo): Observable<Response> { 
        if (this.SHOULD_RESPOND_404_ON_POST) {
            return this.respond404(requestInfo);
        }

        if (this.SHOULD_RESPOND_500_ON_POST) {
            return this.respond500(requestInfo);
        }

        return this.respond200(requestInfo); 
    }

    private respond200(requestInfo: RequestInfo): Observable<Response> {
        return this.respond(requestInfo, STATUS.OK, 'OK');
    }

    private respond404(requestInfo: RequestInfo): Observable<Response> {
        return this.respond(requestInfo, STATUS.NOT_FOUND, 'NOT FOUND');
    }

    private respond500(requestInfo: RequestInfo): Observable<Response> {
        return this.respond(requestInfo, STATUS.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
    }

    private respond(requestInfo: RequestInfo, status: number, statusText: string): Observable<Response> {

        return requestInfo.utils.createResponse$(() => {
            const {headers, url} = requestInfo;

            const options: ResponseOptions = {
                body: this.SERVE_COMPLETE_ENTITIES ? this.completePlayerNeed : this.incompletePlayerNeed, 
                status, 
                statusText, 
                headers, 
                url 
            };

            return options;
          });
    }

}
