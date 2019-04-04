import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDepartmentComponent } from './new-department.component';

describe('NewDepartmentComponent', () => {
  let component: NewDepartmentComponent;
  let fixture: ComponentFixture<NewDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
