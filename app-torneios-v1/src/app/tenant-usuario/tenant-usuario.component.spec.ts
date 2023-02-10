import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUsuarioComponent } from './tenant-usuario.component';

describe('TenantUsuarioComponent', () => {
  let component: TenantUsuarioComponent;
  let fixture: ComponentFixture<TenantUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
