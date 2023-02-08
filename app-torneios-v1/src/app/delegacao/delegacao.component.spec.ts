import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegacaoComponent } from './delegacao.component';

describe('DelegacaoComponent', () => {
  let component: DelegacaoComponent;
  let fixture: ComponentFixture<DelegacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
