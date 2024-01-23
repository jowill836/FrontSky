import { TestBed } from '@angular/core/testing';

import { StarDataService } from './star-data.service';

describe('StarDataService', () => {
  let service: StarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
