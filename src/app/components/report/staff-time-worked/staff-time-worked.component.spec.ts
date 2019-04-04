import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTimeWorkedComponent } from './staff-time-worked.component';

describe('StaffTimeWorkedComponent', () => {
  let component: StaffTimeWorkedComponent;
  let fixture: ComponentFixture<StaffTimeWorkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffTimeWorkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTimeWorkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
