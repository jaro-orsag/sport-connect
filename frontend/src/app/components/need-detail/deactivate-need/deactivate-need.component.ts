import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DetailPageState } from '../../../services/detail-page-state';

@Component({
  selector: 'app-deactivate-need',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './deactivate-need.component.html',
  styleUrl: './deactivate-need.component.sass'
})
export class DeactivateNeedComponent {
    DetailPageState = DetailPageState;

    @Input() pageState!: DetailPageState;

    @Input() handleConfirmedDeactivation!: () => void;

    @Input() dialogText?: string;

    constructor(private dialog: MatDialog) { }

    openDialog(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { 
                text1: this.dialogText,
                text2: "Táto akcia sa nedá vrátiť naspäť. Budeš ale môcť začať nové hladanie.",
                buttonNoText: "Neruš hľadanie",
                buttonYesText: "Zruš hľadanie"
            },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === "do-it") {
                this.handleConfirmedDeactivation();
            }
        });
    }
}
