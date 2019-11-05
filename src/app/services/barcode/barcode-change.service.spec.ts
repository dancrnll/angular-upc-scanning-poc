import { TestBed } from '@angular/core/testing';

import { BarcodeChangeService } from './barcode-change.service';

describe('BarcodeChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarcodeChangeService = TestBed.get(BarcodeChangeService);
    expect(service).toBeTruthy();
  });
});
