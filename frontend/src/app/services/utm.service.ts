import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtmService {

  private utmParams: any = {};

  constructor() {
    this.parseUTMParameters();
  }

  private parseUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    this.utmParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
    };
  }

  getUTMParameters() {
    return this.utmParams;
  }
}
