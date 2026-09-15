import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalendSettings } from './talend-settings';

describe('TalendSettings', () => {
  let component: TalendSettings;
  let fixture: ComponentFixture<TalendSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalendSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(TalendSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
