import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationHistory } from './escalation-history';

describe('EscalationHistory', () => {
  let component: EscalationHistory;
  let fixture: ComponentFixture<EscalationHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalationHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(EscalationHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
