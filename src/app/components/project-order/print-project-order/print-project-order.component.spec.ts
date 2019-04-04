import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProjectOrderComponent } from './print-project-order.component';

describe('PrintProjectOrderComponent', () => {
  let component: PrintProjectOrderComponent;
  let fixture: ComponentFixture<PrintProjectOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProjectOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProjectOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
