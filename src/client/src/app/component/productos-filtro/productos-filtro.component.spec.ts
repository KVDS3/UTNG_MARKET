import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosFiltroComponent } from './productos-filtro.component';

describe('ProductosFiltroComponent', () => {
  let component: ProductosFiltroComponent;
  let fixture: ComponentFixture<ProductosFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosFiltroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
