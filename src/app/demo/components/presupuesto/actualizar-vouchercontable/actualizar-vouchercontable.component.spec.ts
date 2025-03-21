import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarVouchercontableComponent } from './actualizar-vouchercontable.component';

describe('ActualizarVouchercontableComponent', () => {
  let component: ActualizarVouchercontableComponent;
  let fixture: ComponentFixture<ActualizarVouchercontableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarVouchercontableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarVouchercontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
