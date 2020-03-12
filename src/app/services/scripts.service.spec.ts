import { TestBed } from '@angular/core/testing';

import { ScriptsService } from './scripts.service';

describe('ScriptsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScriptsService = TestBed.get(ScriptsService);
    expect(service).toBeTruthy();
  });
});
