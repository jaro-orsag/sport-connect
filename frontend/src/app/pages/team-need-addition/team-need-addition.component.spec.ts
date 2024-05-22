import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNeedAdditionComponent } from './team-need-addition.component';

describe('TeamNeedAdditionComponent', () => {
  let component: TeamNeedAdditionComponent;
  let fixture: ComponentFixture<TeamNeedAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamNeedAdditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamNeedAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
