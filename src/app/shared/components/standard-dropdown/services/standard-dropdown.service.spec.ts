import { TestBed } from '@angular/core/testing';

import { StandardDropdownService } from './standard-dropdown.service';

describe('StandardDropdownService', () => {
  let service: StandardDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandardDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
