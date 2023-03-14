import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscricaoAtletaComponent } from './inscricao-atleta.component';

describe('InscricaoAtletaComponent', () => {
  let component: InscricaoAtletaComponent;
  let fixture: ComponentFixture<InscricaoAtletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscricaoAtletaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscricaoAtletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
