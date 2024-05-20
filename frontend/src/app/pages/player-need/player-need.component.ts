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
import { District } from '../../services/district';
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
        this.districtNames = this._getAllDistricts().map(d => d.name);
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
        return districtNames.map(dn => this._getAllDistricts().filter(d => d.name === dn)[0].code);
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

    private _getAllDistricts(): District[] {
        return [
            { name: "Bánovce nad Bebravou (BN)", code: 301 },
            { name: "Banská Bystrica (BB, BC, BK)", code: 601 },
            { name: "Banská Štiavnica (BS)", code: 602 },
            { name: "Bardejov (BJ)", code: 701 },
            { name: "Bratislava I (BA, BL, BT, BD, BE, BI)", code: 101 },
            { name: "Bratislava II (BA, BL, BT, BD, BE, BI)", code: 102 },
            { name: "Bratislava III (BA, BL, BT, BD, BE, BI)", code: 103 },
            { name: "Bratislava IV (BA, BL, BT, BD, BE, BI)", code: 104 },
            { name: "Bratislava V (BA, BL, BT, BD, BE, BI)", code: 105 },
            { name: "Brezno (BR)", code: 603 },
            { name: "Bytča (BY)", code: 501 },
            { name: "Čadca (CA)", code: 502 },
            { name: "Detva (DT)", code: 604 },
            { name: "Dolný Kubín (DK)", code: 503 },
            { name: "Dunajská Streda (DS)", code: 201 },
            { name: "Galanta (GA)", code: 202 },
            { name: "Gelnica (GL)", code: 801 },
            { name: "Hlohovec (HC)", code: 203 },
            { name: "Humenné (HE)", code: 702 },
            { name: "Ilava (IL)", code: 302 },
            { name: "Kežmarok (KK)", code: 703 },
            { name: "Komárno (KN)", code: 401 },
            { name: "Košice I (KE, KC, KI)", code: 802 },
            { name: "Košice II (KE, KC, KI)", code: 803 },
            { name: "Košice III (KE, KC, KI)", code: 804 },
            { name: "Košice IV (KE, KC, KI)", code: 805 },
            { name: "Košice-okolie (KS)", code: 806 },
            { name: "Krupina (KA)", code: 605 },
            { name: "Kysucké Nové Mesto (KM)", code: 504 },
            { name: "Levice (LV, LL)", code: 402 },
            { name: "Levoča (LE)", code: 704 },
            { name: "Liptovský Mikuláš (LM)", code: 505 },
            { name: "Lučenec (LC)", code: 606 },
            { name: "Malacky (MA)", code: 106 },
            { name: "Martin (MT)", code: 506 },
            { name: "Medzilaborce (ML)", code: 705 },
            { name: "Michalovce (MI)", code: 807 },
            { name: "Myjava (MY)", code: 303 },
            { name: "Námestovo (NO)", code: 507 },
            { name: "Nitra (NR, NI, NT)", code: 403 },
            { name: "Nové Mesto nad Váhom (NM)", code: 304 },
            { name: "Nové Zámky (NZ, NC)", code: 404 },
            { name: "Partizánske (PE)", code: 305 },
            { name: "Pezinok (PK)", code: 107 },
            { name: "Piešťany (PN)", code: 204 },
            { name: "Poltár (PT)", code: 607 },
            { name: "Poprad (PP)", code: 706 },
            { name: "Považská Bystrica (PB)", code: 306 },
            { name: "Prešov (PO, PV, PS)", code: 707 },
            { name: "Prievidza (PD)", code: 307 },
            { name: "Púchov (PU)", code: 308 },
            { name: "Revúca (RA)", code: 608 },
            { name: "Rimavská Sobota (RS)", code: 609 },
            { name: "Rožňava (RV)", code: 808 },
            { name: "Ružomberok (RK)", code: 508 },
            { name: "Sabinov (SB)", code: 708 },
            { name: "Senec (SC)", code: 108 },
            { name: "Senica (SE)", code: 205 },
            { name: "Skalica (SI)", code: 206 },
            { name: "Snina (SV)", code: 709 },
            { name: "Sobrance (SO)", code: 809 },
            { name: "Spišská Nová Ves (SN)", code: 810 },
            { name: "Stará Ľubovňa (SL)", code: 710 },
            { name: "Stropkov (SP)", code: 711 },
            { name: "Svidník (SK)", code: 712 },
            { name: "Šaľa (SA)", code: 405 },
            { name: "Topoľčany (TO)", code: 406 },
            { name: "Trebišov (TV)", code: 811 },
            { name: "Trenčín (TN, TC, TE)", code: 309 },
            { name: "Trnava (TT, TA, TB)", code: 207 },
            { name: "Turčianske Teplice (TR)", code: 509 },
            { name: "Tvrdošín (TS)", code: 510 },
            { name: "Veľký Krtíš (VK)", code: 610 },
            { name: "Vranov nad Topľou (VT)", code: 713 },
            { name: "Zlaté Moravce (ZM)", code: 407 },
            { name: "Zvolen (ZV)", code: 611 },
            { name: "Žarnovica (ZC)", code: 612 },
            { name: "Žiar nad Hronom (ZH)", code: 613 },
            { name: "Žilina (ZA, ZI, ZL)", code: 511 }
        ];
    }
}

