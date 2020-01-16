import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserCompatibiltyComponent } from './browser-compatibilty.component';

describe('BrowserCompatibiltyComponent', () => {
  let component: BrowserCompatibiltyComponent;
  let fixture: ComponentFixture<BrowserCompatibiltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserCompatibiltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserCompatibiltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
