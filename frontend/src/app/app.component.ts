import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
import { PlayerComponent } from './player/player.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ApiService } from './api.service';
import { PlayerRequest } from './player-request';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        RouterOutlet,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatIconModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatCheckboxModule,
        PlayerComponent,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatListModule
    ],
    providers: [ ApiService ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})
export class AppComponent {
    districtsCtrl: FormControl;
    filteredDistricts: Observable<string[]>;
    @ViewChild('districtsInput') districtsInput: ElementRef<HTMLInputElement>;

    playerForm: FormGroup;
    feedbackForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private api: ApiService) {
        this.districtsCtrl = new FormControl('');
        this.filteredDistricts = this.districtsCtrl.valueChanges.pipe(
            startWith(null),
            map((d: string | null) => (d ? this._filter(d) : this._getAllButSelectedDistricts().slice())),
        );

        this.playerForm = this.formBuilder.group({
            name: ['', Validators.required],
            districts: [[] as Array<string>, Validators.required],
            availability: ['', Validators.required],
            email: ['', Validators.required],
            phone: [''],
            about: ['']
        });
        this.feedbackForm = this.formBuilder.group({
            feedback: ['', Validators.required],
            email: ['']
        });
    }

    removeDistrict(district: string): void {
        const index = this.getSelectedDistricts().indexOf(district);

        if (index >= 0) {
            // making copy in order to avoid mutating original array with splice below
            const districts = [...this.getSelectedDistricts()];
            districts.splice(index, 1);

            this.playerForm.patchValue({
                districts
            });
        }
    }

    onSelected(event: MatAutocompleteSelectedEvent): void {
        const districts = [...this.getSelectedDistricts()];
        districts.push(event.option.viewValue);
        this.playerForm.patchValue({
            districts
        });
        
        this.districtsInput.nativeElement.value = '';
        this.districtsCtrl.setValue(null);
    }

    onSubmit(): void {
        const playerRequest = this.playerForm.value as PlayerRequest;

        this.api.add(playerRequest).subscribe(pr => {
            console.log("API call result", pr);
        });
    }

    onFeedbackSubmit(): void {
        console.log('Feedback submission', JSON.stringify(this.feedbackForm.value));
    }

    getSelectedDistricts(): string[] {
        return this.playerForm.value.districts ?? [];
    }

    private _filter(value: string): string[] {
        const filterValue = this._normalize(value);

        return this._getAllDistricts().filter(
            d => this._normalize(d).includes(filterValue)
                // do not allow adding same item multiple times
                && !this.getSelectedDistricts().includes(d)
        );
    }

    private _normalize(denormalized: string): string {
        return denormalized.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }

    private _getAllButSelectedDistricts(): string[] {
        return this._getAllDistricts().filter(d => !this.getSelectedDistricts().includes(d));
    }

    private _getAllDistricts(): string[] {
        return [
            "Bánovce nad Bebravou (BN)",
            "Banská Bystrica (BB, BC, BK)",
            "Banská Štiavnica (BS)",
            "Bardejov (BJ)",
            "Bratislava I (BA, BL, BT, BD, BE, BI)",
            "Bratislava II (BA, BL, BT, BD, BE, BI)",
            "Bratislava III (BA, BL, BT, BD, BE, BI)",
            "Bratislava IV (BA, BL, BT, BD, BE, BI)",
            "Bratislava V (BA, BL, BT, BD, BE, BI)",
            "Brezno (BR)",
            "Bytča (BY)",
            "Čadca (CA)",
            "Detva (DT)",
            "Dolný Kubín (DK)",
            "Dunajská Streda (DS)",
            "Galanta (GA)",
            "Gelnica (GL)",
            "Hlohovec (HC)",
            "Humenné (HE)",
            "Ilava (IL)",
            "Kežmarok (KK)",
            "Komárno (KN)",
            "Košice I (KE, KC, KI)",
            "Košice II (KE, KC, KI)",
            "Košice III (KE, KC, KI)",
            "Košice IV (KE, KC, KI)",
            "Košice-okolie (KS)",
            "Krupina (KA)",
            "Kysucké Nové Mesto (KM)",
            "Levice (LV, LL)",
            "Levoča (LE)",
            "Liptovský Mikuláš (LM)",
            "Lučenec (LC)",
            "Malacky (MA)",
            "Martin (MT)",
            "Medzilaborce (ML)",
            "Michalovce (MI)",
            "Myjava (MY)",
            "Námestovo (NO)",
            "Nitra (NR, NI, NT)",
            "Nové Mesto nad Váhom (NM)",
            "Nové Zámky (NZ, NC)",
            "Partizánske (PE)",
            "Pezinok (PK)",
            "Piešťany (PN)",
            "Poltár (PT)",
            "Poprad (PP)",
            "Považská Bystrica (PB)",
            "Prešov (PO, PV, PS)",
            "Prievidza (PD)",
            "Púchov (PU)",
            "Revúca (RA)",
            "Rimavská Sobota (RS)",
            "Rožňava (RV)",
            "Ružomberok (RK)",
            "Sabinov (SB)",
            "Senec (SC)",
            "Senica (SE)",
            "Skalica (SI)",
            "Snina (SV)",
            "Sobrance (SO)",
            "Spišská Nová Ves (SN)",
            "Stará Ľubovňa (SL)",
            "Stropkov (SP)",
            "Svidník (SK)",
            "Šaľa (SA)",
            "Topoľčany (TO)",
            "Trebišov (TV)",
            "Trenčín (TN, TC, TE)",
            "Trnava (TT, TA, TB)",
            "Turčianske Teplice (TR)",
            "Tvrdošín (TS)",
            "Veľký Krtíš (VK)",
            "Vranov nad Topľou (VT)",
            "Zlaté Moravce (ZM)",
            "Zvolen (ZV)",
            "Žarnovica (ZC)",
            "Žiar nad Hronom (ZH)",
            "Žilina (ZA, ZI, ZL)"
        ];
    }
}
