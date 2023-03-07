import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalidadeComponent } from './localidade.component';

describe('LocalidadeComponent', () => {
  let component: LocalidadeComponent;
  let fixture: ComponentFixture<LocalidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalidadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
