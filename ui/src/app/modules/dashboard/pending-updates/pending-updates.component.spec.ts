import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingUpdatesComponent } from './pending-updates.component';

describe('PendingUpdatesComponent', () => {
  let component: PendingUpdatesComponent;
  let fixture: ComponentFixture<PendingUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
