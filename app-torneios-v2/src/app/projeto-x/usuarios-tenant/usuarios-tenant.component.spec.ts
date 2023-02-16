import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosTenantComponent } from './usuarios-tenant.component';

describe('UsuariosTenantComponent', () => {
  let component: UsuariosTenantComponent;
  let fixture: ComponentFixture<UsuariosTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosTenantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
