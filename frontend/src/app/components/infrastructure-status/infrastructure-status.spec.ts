import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureStatus } from './infrastructure-status';

describe('InfrastructureStatus', () => {
  let component: InfrastructureStatus;
  let fixture: ComponentFixture<InfrastructureStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfrastructureStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(InfrastructureStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
