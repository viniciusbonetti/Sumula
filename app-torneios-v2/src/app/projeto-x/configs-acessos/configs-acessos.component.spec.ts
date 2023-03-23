import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigsAcessosComponent } from './configs-acessos.component';

describe('ConfigsAcessosComponent', () => {
  let component: ConfigsAcessosComponent;
  let fixture: ComponentFixture<ConfigsAcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigsAcessosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigsAcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
