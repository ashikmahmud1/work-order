import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResidentComponent } from './new-resident.component';

describe('NewResidentComponent', () => {
  let component: NewResidentComponent;
  let fixture: ComponentFixture<NewResidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewResidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
