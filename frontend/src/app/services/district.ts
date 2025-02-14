export interface District {
    readonly code: number;
    readonly name: string;
};

export function getDistrictName(districtCode: number): string {
    return getDistricts().filter(d => d.code === districtCode)[0]?.name;
}

export function getDistrictCode(districtName: string): number {
    return getDistricts().filter(d => d.name === districtName)[0]?.code;
}

export function getDistrictNames(): Array<string> {
    return getDistricts().map(d => d.name);
}

export function getDistricts(): District[] {
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