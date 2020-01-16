import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenEndedContractsComponent } from './open-ended-contracts.component';

describe('OpenEndedContractsComponent', () => {
  let component: OpenEndedContractsComponent;
  let fixture: ComponentFixture<OpenEndedContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenEndedContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenEndedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
