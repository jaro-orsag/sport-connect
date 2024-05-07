export interface PlayerRequest {
    readonly id?: string;
    readonly name: string;
    readonly districts: Array<string>;
    readonly availability: string;
    readonly email: string;
    readonly phone?: string;
    readonly about?: string;
    readonly consent: Array<string>;
};