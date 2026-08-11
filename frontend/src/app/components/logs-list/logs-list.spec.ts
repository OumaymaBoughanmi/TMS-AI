import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsList } from './logs-list';

describe('LogsList', () => {
  let component: LogsList;
  let fixture: ComponentFixture<LogsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsList],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
