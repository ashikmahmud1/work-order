import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageDaysCompleteWorkOrdersComponent } from './average-days-complete-work-orders.component';

describe('AverageDaysCompleteWorkOrdersComponent', () => {
  let component: AverageDaysCompleteWorkOrdersComponent;
  let fixture: ComponentFixture<AverageDaysCompleteWorkOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AverageDaysCompleteWorkOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageDaysCompleteWorkOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
