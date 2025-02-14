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

  trackTeamNeedViewDetail(needUuid: string) {
    this.trackNeedEvent("team_need_view_detail", needUuid);
  }

  trackTeamNeedAdditionStart() {
    this.trackNeedEvent("team_need_addition_start");
  }

  trackTeamNeedAdditionFinish(needUuid: string) {
    this.trackNeedEvent("team_need_addition_finish", needUuid);
  }
  
  trackTeamNeedDeactivationFinish(needUuid: string) {
    this.trackNeedEvent("team_need_deactivation_finish", needUuid);
  }

  trackPlayerNeedViewDetail(needUuid: string) {
    this.trackNeedEvent("player_need_view_detail", needUuid);
  }

  trackPlayerNeedAdditionStart() {
    this.trackNeedEvent("player_need_addition_start");
  }

  trackPlayerNeedAdditionFinish(needUuid: string) {
    this.trackNeedEvent("player_need_addition_finish", needUuid);
  }

  trackPlayerNeedDeactivationFinish(needUuid: string) {
    this.trackNeedEvent("player_need_deactivation_finish", needUuid);
  }

  injectGoogleServices() {
    this.injectTrackingId();
  }

  private trackNeedEvent(event: string, needUuid?: string) {
    const event_params = {
        event,
        user_agent: navigator.userAgent,
        transaction_id: needUuid,
        page_title: document.title
    };

    this.trackEvent(event, event_params);
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
    const guidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    const newUrl = url.replace(guidPattern, 'UUID');
    
    return newUrl;
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
}
