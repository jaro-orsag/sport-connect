import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfoUtilities, ParsedRequestUrl } from 'angular-in-memory-web-api';
import { v4 as uuidv4 } from 'uuid';
import { PlayerNeed } from './player-need';

@Injectable({
    providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        const playerNeeds = [
            {
                "id": "72c63f2c-6b02-4854-affd-7a41c3bae6de",
                "uuid": "72c63f2c-6b02-4854-affd-7a41c3bae6de",
                "playerName":"Jaroslav Orság",
                "districtCodes":[
                    301,
                    701
                ],
                "availability":"aaaaaaa",
                "email":"jorsag@gmail.com",
                "phone":"917777614",
                "about":"bbbbbbb",
                "consentIds": [1,2,3,4]
            },
            { id: 12, playerName: 'Dr. Nice' },
            { id: 13, playerName: 'Bombasto' }
        ];
        return { "player-needs": playerNeeds, "team-needs": playerNeeds  };
    }

    genId(_: PlayerNeed[]): number {
        return Math.floor(Math.random() * 1000);
    }
}
