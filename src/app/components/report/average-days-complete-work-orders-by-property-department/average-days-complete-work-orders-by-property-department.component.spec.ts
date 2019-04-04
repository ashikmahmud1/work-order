import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent } from './average-days-complete-work-orders-by-property-department.component';

describe('AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent', () => {
  let component: AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent;
  let fixture: ComponentFixture<AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageDaysCompleteWorkOrdersByPropertyDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
