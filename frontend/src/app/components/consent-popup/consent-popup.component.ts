import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { GdprConsentService } from '../../services/gdpr-consent.service';

@Component({
    standalone: true,
    selector: 'app-consent-popup',
    templateUrl: './consent-popup.component.html',
    styleUrls: ['./consent-popup.component.sass'],
    imports: [
        MatDialogContent,
        CommonModule,
        MatToolbar,
        RouterLink
    ]
})
export class ConsentPopupComponent {

    constructor(private dialog: MatDialog, private gdprConsentService: GdprConsentService) { }

    acceptCookies() {
        this.gdprConsentService.setGranted();
        this.dialog.closeAll();
    }

    declineCookies() {
        this.gdprConsentService.setDeclined();
        this.dialog.closeAll();
    }
}
