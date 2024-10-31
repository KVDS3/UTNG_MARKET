import { TestBed } from '@angular/core/testing';

import { AgreProductoService } from './agre-producto.service';

describe('AgreProductoService', () => {
  let service: AgreProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgreProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
