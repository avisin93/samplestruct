import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitationOfLiabillityComponent } from './limitation-of-liabillity.component';

describe('LimitationOfLiabillityComponent', () => {
  let component: LimitationOfLiabillityComponent;
  let fixture: ComponentFixture<LimitationOfLiabillityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitationOfLiabillityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitationOfLiabillityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
