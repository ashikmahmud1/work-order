import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssetComponent } from './new-asset.component';

describe('NewAssetComponent', () => {
  let component: NewAssetComponent;
  let fixture: ComponentFixture<NewAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
