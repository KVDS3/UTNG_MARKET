import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreDireccionComponent } from './agre-direccion.component';

describe('AgreDireccionComponent', () => {
  let component: AgreDireccionComponent;
  let fixture: ComponentFixture<AgreDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreDireccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgreDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
