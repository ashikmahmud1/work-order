import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageDaysCompleteWorkOrdersByPropertyComponent } from './average-days-complete-work-orders-by-property.component';

describe('AverageDaysCompleteWorkOrdersByPropertyComponent', () => {
  let component: AverageDaysCompleteWorkOrdersByPropertyComponent;
  let fixture: ComponentFixture<AverageDaysCompleteWorkOrdersByPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AverageDaysCompleteWorkOrdersByPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageDaysCompleteWorkOrdersByPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
