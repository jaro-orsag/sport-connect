import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfoUtilities, ParsedRequestUrl } from 'angular-in-memory-web-api';
import { v4 as uuidv4 } from 'uuid';
import { PlayerNeed } from './player-need';

@Injectable({
    providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

    createDb() {
        const playerRequests = [
            { id: 12, playerName: 'Dr. Nice' },
            { id: 13, playerName: 'Bombasto' }
        ];
        return { "player-requests": playerRequests, "team-needs": playerRequests  };
    }

    genId(_: PlayerNeed[]): number {
        return Math.floor(Math.random() * 1000);
    }
}
