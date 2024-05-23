export interface TeamNeed {
    readonly id?: number;
    readonly uuid?: string
    readonly isActive: boolean;
    readonly districtCode: number;
    readonly address?: string;
    readonly time: string;
    readonly playerName: string;
    readonly email: string;
    readonly phone?: string;
    readonly about?: string;
    readonly dateAdded?: Date;
    readonly consentIds: Array<number>;
};