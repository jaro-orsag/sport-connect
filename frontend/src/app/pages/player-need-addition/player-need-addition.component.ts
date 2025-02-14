import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
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
import { SeoService } from '../../services/seo.service';
import { OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
    selector: 'player-need-addition',
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
    templateUrl: './player-need-addition.component.html',
    styleUrl: './player-need-addition.component.sass'
})
export class PlayerNeedAdditionComponent implements OnInit {
    districtNames: string[];
    districtsCtrl: FormControl;
    filteredDistricts: Observable<string[]>;
    @ViewChild('districtsInput') districtsInput!: ElementRef<HTMLInputElement>;
    isSubmitting = false;

    playerNeedForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private api: ApiService,
        private snackBar: MatSnackBar,
        private router: Router,
        private seoService: SeoService,
        private analyticsService: AnalyticsService
    ) {
        this.districtNames = getDistrictNames();
        this.districtsCtrl = new FormControl('');
        this.filteredDistricts = this.districtsCtrl.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? this._filter(d) : this._getAllButSelectedDistrictNames().slice())),
        );

        this.playerNeedForm = this.formBuilder.group({
            playerName: ['', Validators.required],
            districtNames: [[] as Array<string>, Validators.required],
            availability: ['', Validators.required],
            email: ['', Validators.required],
            phone: [''],
            about: [''],
            generalConditions: [true, Validators.requiredTrue],
            thirdPartyMarketing: [true]
        });
    }

    ngOnInit() {
        this.seoService.updateTitle("futbal-spoluhráč.sk | Hľadaj tím na futbal");
        this.seoService.updateMetaTags([
            { name: 'description', content: 'Vyplň jednoduchý formulár a okamžite pre Teba začneme hľadať tím na futbal.' }
        ]);
        this.analyticsService.trackPlayerNeedAdditionStart();
    }

    removeDistrict(district: string): void {
        const index = this.getSelectedDistrictNames().indexOf(district);

        if (index >= 0) {
            // making copy in order to avoid mutating original array with splice below
            const districtNames = [...this.getSelectedDistrictNames()];
            districtNames.splice(index, 1);

            this.playerNeedForm.patchValue({
                districtNames
            });
        }
    }

    onSelected(event: MatAutocompleteSelectedEvent): void {
        const districtNames = [...this.getSelectedDistrictNames()];
        districtNames.push(event.option.viewValue);
        this.playerNeedForm.patchValue({
            districtNames
        });

        this.districtsInput.nativeElement.value = '';
        this.districtsCtrl.setValue(null);
    }

    onSubmit(): void {
        if (this.isSubmitting === true) {
            return;
        }

        if (this.playerNeedForm.invalid) {
            this.snackBar.open("Formulár nebol odoslaný. Najskôr vyplň všetky povinné polia.", "OK");

            return;
        }

        const playerNeed = this._mapFormToPlayerNeed(this.playerNeedForm.value);
        this.isSubmitting = true;
        this.api.addPlayerNeed(playerNeed).subscribe(pn => {
            this.analyticsService.trackPurchase(pn.uuid!, "player_need");
            this.analyticsService.trackPlayerNeedAdditionFinish(pn.uuid!);
            this.isSubmitting = false;
            this.router.navigate(["/player-need", pn.uuid], { state: { navigatedFromAddition: true } });
        });
    }

    getSelectedDistrictNames(): string[] {
        return this.playerNeedForm.value.districtNames ?? [];
    }

    private _mapFormToPlayerNeed(formModel: any): PlayerNeed {
        // form model is bit different to real model
        //      - we were strugglign with autocomplete if districts were complex values rather than strings
        //      - we are mapping coarse-grained checkboxes to fine-grained consents
        return {
            isActive: true,
            playerName: formModel.playerName,
            availability: formModel.availability,
            email: formModel.email,
            phone: formModel.phone,
            about: formModel.about,
            districtCodes: this._mapDistrictNamesToDistrictCodes(formModel.districtNames),
            isMarketingConsentGranted: formModel.thirdPartyMarketing
        }
    }

    private _mapDistrictNamesToDistrictCodes(districtNames: string[]): number[] {
        return districtNames.map(getDistrictCode);
    }

    private _filter(value: string): string[] {
        const filterValue = this._normalize(value);

        return this.districtNames.filter(
            d => this._normalize(d).includes(filterValue)
                // do not allow adding same item multiple times
                && !this.getSelectedDistrictNames().includes(d)
        );
    }

    private _normalize(denormalized: string): string {
        return denormalized.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }

    private _getAllButSelectedDistrictNames(): string[] {
        return this.districtNames.filter(d => !this.getSelectedDistrictNames().includes(d));
    }

}
