import { District } from "./district";

export interface PlayerNeed {
    readonly id?: string;
    readonly name: string;
    readonly districts: Array<District>;
    readonly availability: string;
    readonly email: string;
    readonly phone?: string;
    readonly about?: string;
    readonly consent: Array<string>;
};