import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectOrderComponent } from './edit-project-order.component';

describe('EditProjectOrderComponent', () => {
  let component: EditProjectOrderComponent;
  let fixture: ComponentFixture<EditProjectOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProjectOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
