import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPagoComponent } from './confirm-pago.component';

describe('ConfirmPagoComponent', () => {
  let component: ConfirmPagoComponent;
  let fixture: ComponentFixture<ConfirmPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
