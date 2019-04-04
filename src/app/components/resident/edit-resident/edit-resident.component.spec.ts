import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResidentComponent } from './edit-resident.component';

describe('EditResidentComponent', () => {
  let component: EditResidentComponent;
  let fixture: ComponentFixture<EditResidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditResidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
