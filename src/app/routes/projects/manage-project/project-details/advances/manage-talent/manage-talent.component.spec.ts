import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTalentComponent } from './manage-talent.component';

describe('ManageTalentComponent', () => {
  let component: ManageTalentComponent;
  let fixture: ComponentFixture<ManageTalentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTalentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
