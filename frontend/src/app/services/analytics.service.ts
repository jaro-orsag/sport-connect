import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var gtag: Function;

type NeedType = "player-need" | "team-need";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {
    this.injectTrackingId();
  }

  trackPageView(url: string) {
    const event_params = {
        page_location: this.sanitizeUrl(url),
        page_title: document.title,
        user_agent: navigator.userAgent
    };

    this.trackEvent('page_view', event_params);
  }

  trackNeedCreation(needUuid: string, needType: NeedType) {
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

  private async trackEvent(event: string, event_params: any) {

    event_params = {
        ...event_params,
        client_id: 'not available in development mode'
    };

    if (environment.isDevelopment) {
        console.log(`would track ${event} if not development mode`, event_params);

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
    if (environment.isDevelopment) {
        console.log(`would inject google tracking ID if not development mode`);

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
