import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosCcoComponent } from './cargos-cco.component';

describe('CargosCcoComponent', () => {
  let component: CargosCcoComponent;
  let fixture: ComponentFixture<CargosCcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargosCcoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargosCcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
