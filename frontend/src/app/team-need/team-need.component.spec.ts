import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNeedComponent } from './team-need.component';

describe('TeamNeedComponent', () => {
  let component: TeamNeedComponent;
  let fixture: ComponentFixture<TeamNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamNeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
