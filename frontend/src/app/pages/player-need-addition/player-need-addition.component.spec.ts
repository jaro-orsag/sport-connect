import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNeedAdditionComponent } from './player-need-addition.component';

describe('PlayerNeedAdditionComponent', () => {
  let component: PlayerNeedAdditionComponent;
  let fixture: ComponentFixture<PlayerNeedAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerNeedAdditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerNeedAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
