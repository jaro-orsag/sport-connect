export interface PlayerNeed {
    readonly id?: number;
    readonly uuid?: string;
    readonly isActive: boolean;
    readonly playerName: string;
    readonly districtCodes: Array<number>;
    readonly availability: string;
    readonly email: string;
    readonly phone?: string;
    readonly about?: string;
    readonly dateAdded?: Date;
    readonly consentIds: Array<number>;
};