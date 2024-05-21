import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNeedDetailComponent } from './player-need-detail.component';

describe('PlayerNeedDetailComponent', () => {
  let component: PlayerNeedDetailComponent;
  let fixture: ComponentFixture<PlayerNeedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerNeedDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerNeedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
