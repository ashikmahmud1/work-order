import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullWorkOrderComponent } from './full-work-order.component';

describe('FullWorkOrderComponent', () => {
  let component: FullWorkOrderComponent;
  let fixture: ComponentFixture<FullWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
