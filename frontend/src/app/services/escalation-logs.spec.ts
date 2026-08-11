import { TestBed } from '@angular/core/testing';

import { EscalationLogs } from './escalation-logs';

describe('EscalationLogs', () => {
  let service: EscalationLogs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscalationLogs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
