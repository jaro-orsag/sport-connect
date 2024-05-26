import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getDistrictCode, getDistrictNames } from '../../services/district';
import { TeamNeed } from '../../services/team-need';
import { Router } from '@angular/router';

@Component({
    selector: 'team-need',
    standalone: true,
    imports: [
        FormsModule,
        RouterOutlet,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatIconModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatCheckboxModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatListModule,
        CommonModule
    ],
    providers: [ApiService],
    templateUrl: './team-need-addition.component.html',
    styleUrl: './team-need-addition.component.sass'
})
export class TeamNeedAdditionComponent {
    @ViewChild('districtsInput') districtsInput!: ElementRef<HTMLInputElement>;

    teamNeedForm: FormGroup;


    @ViewChild('districtInput') districtInput!: ElementRef<HTMLInputElement>;
    options: string[] = getDistrictNames();
    filteredDistricts: string[];

    constructor(
        private formBuilder: FormBuilder, 
        private api: ApiService, 
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.filteredDistricts = this.options.slice();

        this.teamNeedForm = this.formBuilder.group({
            districtName: ['', Validators.required],
            address: [''],
            time: ['', Validators.required],
            playerName: ['', Validators.required],
            email: ['', Validators.required],
            phone: [''],
            about: [''],
            generalConditions: [true, Validators.requiredTrue],
            thirdPartyMarketing: [true]
        });
    }


    filterDistricts(): void {
        const filterValue = this.districtInput.nativeElement.value.toLowerCase();
        this.filteredDistricts = this.options.filter(o => o.toLowerCase().includes(filterValue));
      }

    onSubmit(): void {
        if (this.teamNeedForm.invalid) {
            this.snackBar.open("Formulár nebol odoslaný. Najskôr vyplň všetky povinné polia.", "OK");

            return;
        }

        const teamNeed = this._mapFormToPlayerNeed(this.teamNeedForm.value);
        this.api.addTeamNeed(teamNeed).subscribe(tn => {
            this.router.navigate(["/team-need", tn.uuid], { state: { navigatedFromTeamNeedAddition: true }});
        });
    }

    private _mapFormToPlayerNeed(formModel: any): TeamNeed {
        // form model is bit different to real model
        //      - we were strugglign with autocomplete if districts were complex values rather than strings
        //      - we are mapping coarse-grained checkboxes to fine-grained consents
        return {
            isActive: true,
            districtCode: getDistrictCode(formModel.districtName),
            address: formModel.address,
            time: formModel.time,
            playerName: formModel.playerName,            
            email: formModel.email,
            phone: formModel.phone,
            about: formModel.about,
            isMarketingConsentGranted: formModel.thirdPartyMarketing
        }
    }
}
