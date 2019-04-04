import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuildingComponent } from './edit-building.component';

describe('EditBuildingComponent', () => {
  let component: EditBuildingComponent;
  let fixture: ComponentFixture<EditBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
