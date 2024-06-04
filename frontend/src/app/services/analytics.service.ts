import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UtmService } from './utm.service';
import { GdprConsentService } from './gdpr-consent.service';

declare var gtag: Function;

type NeedType = "player_need" | "team_need";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  utmParameters: any = {}

  constructor(private utmService: UtmService, private gdprConsentService: GdprConsentService) {
    this.utmParameters = this.utmService.getUTMParameters();
  }

  trackPageView(url: string) {
    const event_params = {
        page_location: this.sanitizeUrl(url),
        page_title: document.title,
        user_agent: navigator.userAgent
    };

    this.trackEvent('page_view', event_params);
  }

  /**
   * Track purchase is redundant with track*NeedAddition. The reason why it exists is, that we want to experiment 
   * with recommended events (purchase) and custom events (track*NeedAddition).
   * @param needUuid 
   * @param needType 
   */
  trackPurchase(needUuid: string, needType: NeedType) {
    const event_params = {
        user_agent: navigator.userAgent,
        currency: "EUR",
        value: 0.30,
        transaction_id: needUuid,
        items: [{
            item_id: needType,
            item_name: needType
        }]
    };

    this.trackEvent('purchase', event_params);
  }

  trackTeamNeedDeactivation(needUuid: string) {
    this.trackNeedEvent("team_need", "deactivation", needUuid);
  }

  trackTeamNeedAddition(needUuid: string) {
    this.trackNeedEvent("team_need", "addition", needUuid);
  }

  trackPlayerNeedDeactivation(needUuid: string) {
    this.trackNeedEvent("player_need", "deactivation", needUuid);
  }

  trackPlayerNeedAddition(needUuid: string) {
    this.trackNeedEvent("player_need", "addition", needUuid);
  }

  injectGoogleServices() {
    this.injectTrackingId();
    this.injectAdsenseSnippet();
  }

  private trackNeedEvent(needType: NeedType, event: string, needUuid: string) {
    const fullEventName = `${needType}_${event}`;
    const event_params = {
        event: fullEventName,
        user_agent: navigator.userAgent,
        transaction_id: needUuid,
        page_title: document.title
    };

    this.trackEvent(fullEventName, event_params);
  }

  private async trackEvent(event: string, event_params: any) {

    event_params = {
        ...event_params,
        ...this.utmParameters,
        client_id: 'not available in development mode'
    };

    if (environment.isDevelopment || !this.gdprConsentService.isGranted()) {
        console.log(`would track ${event}; development mode: ${environment.isDevelopment}; GDPR consent granted: ${this.gdprConsentService.isGranted()}`, event_params);

        return;
    }

    event_params = {
        ...event_params,
        client_id: await this.getClientId()
    };

    gtag('event', event, event_params)
  }

  private sanitizeUrl(url: string): string {
    // maybe we will have to replace identifier with some constant here

    return url;
  }

  private getClientId(): Promise<string> {
    return new Promise((resolve, reject) => {
      gtag('get', environment.googleAnalyticsTrackingId, 'client_id', (clientId: string) => {
        if (clientId) {
          resolve(clientId);
        } else {
          reject('Client ID not found');
        }
      });
    });
  }

  /**
   * 
   * @returns We are injecting tracking ID dynamically to be able to use different ID for staging and prod
   */
  private injectTrackingId() {
    if (environment.isDevelopment || !this.gdprConsentService.isGranted()) {
        console.log(`would inject google tracking ID; development mode: ${environment.isDevelopment}; GDPR consent granted: ${this.gdprConsentService.isGranted()}`);

        return;
    }

    const trackingId = environment.googleAnalyticsTrackingId;
    if (trackingId) {
      // Load the Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize Google Analytics
      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
      `;
      document.head.appendChild(inlineScript);
    }
  }

  private injectAdsenseSnippet() {
    if (environment.isDevelopment 
        || !this.gdprConsentService.isGranted()
        || !environment.googleAdSenseClientId
    ) {
        const consoleMessage = `would inject google adsense snippet; ` 
            + `development mode: ${environment.isDevelopment}; `
            + `GDPR consent granted: ${this.gdprConsentService.isGranted()}; `
            + `googleAdSenseClientId defined: ${environment.googleAdSenseClientId !== undefined}`;
        console.log(consoleMessage);

        return;
    }

    const metaTag = document.createElement('meta');
    metaTag.name = 'google-adsense-account';
    metaTag.content = environment.googleAdSenseClientId;
    document.head.appendChild(metaTag);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${environment.googleAdSenseClientId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }
}
