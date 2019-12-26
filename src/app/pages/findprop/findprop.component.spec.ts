import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindpropComponent } from './findprop.component';

describe('FindpropComponent', () => {
  let component: FindpropComponent;
  let fixture: ComponentFixture<FindpropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindpropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindpropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
