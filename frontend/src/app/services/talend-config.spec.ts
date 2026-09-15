import { TestBed } from '@angular/core/testing';

import { TalendConfig } from './talend-config';

describe('TalendConfig', () => {
  let service: TalendConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalendConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
