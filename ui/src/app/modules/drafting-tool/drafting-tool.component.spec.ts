import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftingToolComponent } from './drafting-tool.component';

describe('DraftingToolComponent', () => {
  let component: DraftingToolComponent;
  let fixture: ComponentFixture<DraftingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftingToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
