import { TestBed, inject } from '@angular/core/testing';

import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemingService]
    });
  });

  it('should be created', inject([ThemingService], (service: ThemingService) => {
    expect(service).toBeTruthy();
  }));
});
