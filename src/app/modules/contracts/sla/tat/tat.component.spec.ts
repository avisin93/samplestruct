import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TatComponent } from './tat.component';

describe('TatComponent', () => {
  let component: TatComponent;
  let fixture: ComponentFixture<TatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
