import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {
    this.injectTrackingId();
  }

  async trackPageView(url: string) {

    const event = 'page_view';

    const page_location = this.sanitizeUrl(url);
    const page_title = document.title;
    const user_agent = navigator.userAgent;

    let event_params = {
        client_id: 'not available in development mode',
        page_location,
        page_title,
        user_agent
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
