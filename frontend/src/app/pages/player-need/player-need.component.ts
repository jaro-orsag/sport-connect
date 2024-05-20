import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Observable, tap } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api.service';
import { PlayerNeed } from '../../services/player-need';
import { getDistrictCode, getDistrictNames } from '../../services/district';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consent } from '../../services/consent';

@Component({
    selector: 'player-need',
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
    templateUrl: './player-need.component.html',
    styleUrl: './player-need.component.sass'
})
export class PlayerNeedComponent {
    districtNames: string[];
    districtsCtrl: FormControl;
    filteredDistricts: Observable<string[]>;
    @ViewChild('districtsInput') districtsInput!: ElementRef<HTMLInputElement>;

    playerNeedForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private api: ApiService, private formInvalidSnackBar: MatSnackBar) {
        this.districtNames = getDistrictNames();
        this.districtsCtrl = new FormControl('');
        this.filteredDistricts = this.districtsCtrl.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? this._filter(d) : this._getAllButSelectedDistricts().slice())),
        );

        this.playerNeedForm = this.formBuilder.group({
            name: ['', Validators.required],
            districts: [[] as Array<string>, Validators.required],
            availability: ['', Validators.required],
            email: ['', Validators.required],
            phone: [''],
            about: [''],
            generalConditions: [true, Validators.requiredTrue],
            thirdPartyMarketing: [true]
        });
    }

    removeDistrict(district: string): void {
        const index = this.getSelectedDistricts().indexOf(district);

        if (index >= 0) {
            // making copy in order to avoid mutating original array with splice below
            const districts = [...this.getSelectedDistricts()];
            districts.splice(index, 1);

            this.playerNeedForm.patchValue({
                districts
            });
        }
    }

    onSelected(event: MatAutocompleteSelectedEvent): void {
        const districts = [...this.getSelectedDistricts()];
        districts.push(event.option.viewValue);
        this.playerNeedForm.patchValue({
            districts
        });

        this.districtsInput.nativeElement.value = '';
        this.districtsCtrl.setValue(null);
    }

    onSubmit(): void {
        if (this.playerNeedForm.invalid) {
            this.formInvalidSnackBar.open("Formulár nebol odoslaný. Najskôr vyplň všetky povinné polia.", "OK");
        }

        const playerNeed = this._mapFormToPlayerNeed(this.playerNeedForm.value);

        this.api.add(playerNeed).subscribe(pr => {
            console.log("API call result", pr);
        });
    }

    getSelectedDistricts(): string[] {
        return this.playerNeedForm.value.districts ?? [];
    }

    private _mapFormToPlayerNeed(formModel: any): PlayerNeed {
        // form model is bit different to real model
        //      - we were strugglign with autocomplete if districts were complex values rather than strings
        //      - we are mapping coarse-grained checkboxes to fine-grained consents
        return {
            name: formModel.name,
            availability: formModel.availability,
            email: formModel.email,
            phone: formModel.phone,
            about: formModel.about,
            districts: this._mapDistrictNamesToDistrictCodes(formModel.districts),
            consents: this._mapCheckboxesToConsents(formModel.generalConditions, formModel.thirdPartyMarketing)
        }
    }

    private _mapDistrictNamesToDistrictCodes(districtNames: string[]): number[] {
        return districtNames.map(getDistrictCode);
    }

    private _mapCheckboxesToConsents(generalConditions: boolean, thirdPartyMarketing: boolean): number[] {
        const generalConditionsConsents = generalConditions
            ? [Consent.PLAYER_STORE_DATA, Consent.PLAYER_PROVIDE_DATA_TO_TEAMS, Consent.PLAYER_AGE]
            : [];
        const thirdPartyMarketingConsents = thirdPartyMarketing ? [Consent.PLAYER_PROVIDE_DATA_TO_THIRD_PARTIES] : [];

        return generalConditionsConsents.concat(thirdPartyMarketingConsents);
    }

    private _filter(value: string): string[] {
        const filterValue = this._normalize(value);

        return this.districtNames.filter(
            d => this._normalize(d).includes(filterValue)
                // do not allow adding same item multiple times
                && !this.getSelectedDistricts().includes(d)
        );
    }

    private _normalize(denormalized: string): string {
        return denormalized.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }

    private _getAllButSelectedDistricts(): string[] {
        return this.districtNames.filter(d => !this.getSelectedDistricts().includes(d));
    }

}

