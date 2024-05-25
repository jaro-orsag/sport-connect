import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedSummaryListItemComponent } from './need-summary-list-item.component';

describe('NeedSummaryListItemComponent', () => {
  let component: NeedSummaryListItemComponent;
  let fixture: ComponentFixture<NeedSummaryListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedSummaryListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NeedSummaryListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
