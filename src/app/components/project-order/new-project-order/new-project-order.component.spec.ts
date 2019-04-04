import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectOrderComponent } from './new-project-order.component';

describe('NewProjectOrderComponent', () => {
  let component: NewProjectOrderComponent;
  let fixture: ComponentFixture<NewProjectOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProjectOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
