import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions, STATUS, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

    SHOW_COMPLETE_ENTITIES = true;

    completePlayerNeed = { 
        "id": 1, 
        "uuid": "5f444def-1529-4705-9a9e-a59f66c1cc1e", 
        "playerName": "Jaroslav Ors\u00e1g", 
        "availability": "Môžem keždý druhý utorok o 16:00. Alebo každú stredu na obed.", 
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
        "playerName": "Jaroslav Ors\u00e1g", 
        "availability": "Môžem keždý druhý utorok o 16:00. Alebo každú stredu na obed.", 
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

    get(requestInfo: RequestInfo): Observable<Response> { return this.respond(requestInfo); }

    post(requestInfo: RequestInfo): Observable<Response> { return this.respond(requestInfo); }

    private respond(requestInfo: RequestInfo): Observable<Response> {

        return requestInfo.utils.createResponse$(() => {
            const {headers, url} = requestInfo;

            const options: ResponseOptions = {
                body: this.SHOW_COMPLETE_ENTITIES ? this.completePlayerNeed : this.incompletePlayerNeed, 
                status: STATUS.OK, 
                statusText: 'OK', 
                headers, 
                url 
            };

            return options;
          });
    }

}
