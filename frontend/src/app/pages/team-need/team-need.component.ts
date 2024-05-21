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
import { District } from '../../services/district';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consent } from '../../services/consent';
import { getDistrictCode, getDistrictNames } from '../../services/district';
import { TeamNeed } from '../../services/team-need';

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
    templateUrl: './team-need.component.html',
    styleUrl: './team-need.component.sass'
})
export class TeamNeedComponent {
    @ViewChild('districtsInput') districtsInput!: ElementRef<HTMLInputElement>;

    teamNeedForm: FormGroup;


    @ViewChild('districtInput') districtInput!: ElementRef<HTMLInputElement>;
    options: string[] = getDistrictNames();
    filteredDistricts: string[];



    constructor(private formBuilder: FormBuilder, private api: ApiService, private formInvalidSnackBar: MatSnackBar) {
        this.filteredDistricts = this.options.slice();

        this.teamNeedForm = this.formBuilder.group({
            district: ['', Validators.required],
            address: [''],
            time: ['', Validators.required],
            name: ['', Validators.required],
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
            this.formInvalidSnackBar.open("Formulár nebol odoslaný. Najskôr vyplň všetky povinné polia.", "OK");
        }

        const teamNeed = this._mapFormToPlayerNeed(this.teamNeedForm.value);

        console.log(teamNeed);

        this.api.addTeamNeed(teamNeed).subscribe(tn => {
            console.log("API call result", tn);
        });
    }

    private _mapFormToPlayerNeed(formModel: any): TeamNeed {
        // form model is bit different to real model
        //      - we were strugglign with autocomplete if districts were complex values rather than strings
        //      - we are mapping coarse-grained checkboxes to fine-grained consents
        return {
            district: getDistrictCode(formModel.district),
            address: formModel.address,
            time: formModel.time,
            name: formModel.name,            
            email: formModel.email,
            phone: formModel.phone,
            about: formModel.about,
            consents: this._mapCheckboxesToConsents(formModel.generalConditions, formModel.thirdPartyMarketing)
        }
    }

    private _mapCheckboxesToConsents(generalConditions: boolean, thirdPartyMarketing: boolean): number[] {
        const generalConditionsConsents = generalConditions
            ? [Consent.TEAM_STORE_DATA, Consent.TEAM_PROVIDE_DATA_TO_TEAMS, Consent.TEAM_AGE]
            : [];
        const thirdPartyMarketingConsents = thirdPartyMarketing ? [Consent.TEAM_PROVIDE_DATA_TO_THIRD_PARTIES] : [];

        return generalConditionsConsents.concat(thirdPartyMarketingConsents);
    }
}
