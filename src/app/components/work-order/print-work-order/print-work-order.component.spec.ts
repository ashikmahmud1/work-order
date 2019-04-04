import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWorkOrderComponent } from './print-work-order.component';

describe('PrintWorkOrderComponent', () => {
  let component: PrintWorkOrderComponent;
  let fixture: ComponentFixture<PrintWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
