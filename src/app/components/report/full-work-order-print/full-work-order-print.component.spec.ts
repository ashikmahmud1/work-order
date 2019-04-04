import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullWorkOrderPrintComponent } from './full-work-order-print.component';

describe('FullWorkOrderPrintComponent', () => {
  let component: FullWorkOrderPrintComponent;
  let fixture: ComponentFixture<FullWorkOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullWorkOrderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullWorkOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
