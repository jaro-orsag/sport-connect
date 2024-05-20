export interface TeamNeed {
    readonly id?: string;
    readonly district: number;
    readonly address?: string;
    readonly time: string;
    readonly name: string;
    readonly email: string;
    readonly phone?: string;
    readonly about?: string;
    readonly consents: Array<number>;
};