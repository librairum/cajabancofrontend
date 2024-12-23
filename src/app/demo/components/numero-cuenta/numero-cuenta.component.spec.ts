import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroCuentaComponent } from './numero-cuenta.component';

describe('NumeroCuentaComponent', () => {
  let component: NumeroCuentaComponent;
  let fixture: ComponentFixture<NumeroCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumeroCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumeroCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
