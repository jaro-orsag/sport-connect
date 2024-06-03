import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GdprConsentService {
    isConsentGranted: boolean | undefined;

    constructor() { }

    isGranted(): boolean {
        if (this.isConsentGranted !== undefined) {

            return this.isConsentGranted;
        }
        const consent = this.getCookie('userConsent');

        this.isConsentGranted = consent === 'granted';

        return this.isConsentGranted;
    }

    setGranted() {
        this.setCookie('userConsent', 'granted', 365);
        this.isConsentGranted = true;
    }

    setDeclined() {
        this.setCookie('userConsent', 'declined', 365);
        this.isConsentGranted = false;
    }

    private getCookie(name: string) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]?.trim();
            if (cookie.indexOf(nameEQ) == 0) {

                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    private setCookie(name: string, value: string, days: number) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }
}
