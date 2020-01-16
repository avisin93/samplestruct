import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractsMetaSubtabTableAddPanelComponent } from './add-panel.component';

describe('ContractsMetaSubtabTableAddPanelComponent', () => {
  let component: ContractsMetaSubtabTableAddPanelComponent;
  let fixture: ComponentFixture<ContractsMetaSubtabTableAddPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMetaSubtabTableAddPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMetaSubtabTableAddPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
