import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreProductoComponent } from './agre-producto.component';

describe('AgreProductoComponent', () => {
  let component: AgreProductoComponent;
  let fixture: ComponentFixture<AgreProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgreProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
