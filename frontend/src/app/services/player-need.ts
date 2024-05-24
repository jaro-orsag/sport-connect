export interface PlayerNeed {
    readonly id?: number;
    readonly uuid?: string;
    readonly isActive: boolean;
    readonly dateDeactivated?: Date;
    readonly playerName: string;
    readonly districtCodes: Array<number>;
    readonly availability: string;
    readonly email: string;
    readonly phone?: string;
    readonly about?: string;
    readonly isMarketingConsentGranted: boolean;
    readonly dateMarketingConsentChanged?: Date;
    readonly dateAdded?: Date;
};