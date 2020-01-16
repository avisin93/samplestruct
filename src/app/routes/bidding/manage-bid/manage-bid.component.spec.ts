import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBidComponent } from './manage-bid.component';

describe('ManageBidComponent', () => {
  let component: ManageBidComponent;
  let fixture: ComponentFixture<ManageBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
