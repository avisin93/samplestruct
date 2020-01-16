import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentInfoComponent } from './talent-info.component';

describe('TalentInfoComponent', () => {
  let component: TalentInfoComponent;
  let fixture: ComponentFixture<TalentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
