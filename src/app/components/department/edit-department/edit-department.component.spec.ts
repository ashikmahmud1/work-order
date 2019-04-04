import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDepartmentComponent } from './edit-department.component';

describe('EditDepartmentComponent', () => {
  let component: EditDepartmentComponent;
  let fixture: ComponentFixture<EditDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
