import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNeedComponent } from './player-need.component';

describe('PlayerNeedComponent', () => {
  let component: PlayerNeedComponent;
  let fixture: ComponentFixture<PlayerNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerNeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
