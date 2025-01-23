import { CardModule } from 'primeng/card';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Banco } from './Banco';
import { BancoService } from '../../service/banco.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MensajemodalComponent } from "../mensajemodal/mensajemodal.component";
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [CardModule,ButtonModule, TableModule, InputTextModule, DialogModule, ReactiveFormsModule, FormsModule,
    PanelModule, ConfirmDialogModule, MensajemodalComponent, CommonModule, BreadcrumbModule],
  templateUrl: './banco.component.html',
  styleUrl: './banco.component.css',
  providers: [ConfirmationService]
})
export class BancoComponent {
  bancos: Banco[] = [];
  originalBancos: Banco[] = [];
  selectedBanco: Banco | null = null;
  formBanco: FormGroup;
  visible: boolean = false;
  mostrarMensajeModal: boolean = false;
  mensajeModal: string = '';
  displayDialog: boolean = false;
  items: any[] = [];
  currentBancoDescripcion: string;
  banco: Banco[] = [];

  constructor(private bancoService: BancoService, private fb: FormBuilder, private bS: BreadcrumbService, private router: Router) {
    //bancoService.GetBancos().subscribe(res => {this.bancoList = res; console.log(this.bancoList); }, error => console.log(error));
    this.formBanco = fb.group({
      ban01Empresa: ['', Validators.required],
      ban01IdBanco: ['', Validators.required],
      ban01Descripcion: ['', Validators.required],
      ban01Prefijo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bS.setBreadcrumbs([
      { icon: 'pi pi-home', routerLink: '/' },
      { label: 'Banco', routerLink: '/bancos' }
    ]);
    this.bS.currentBreadcrumbs$.subscribe(bc => {
      this.items = bc;
    })
    this.llenarData();
  };

  // Función para navegar a las cuentas del banco seleccionado
  verCuentas(banco): void {
    // Primero, actualiza las migas de pan antes de navegar
    this.bS.setBreadcrumbs([
      { icon: 'pi pi-home', routerLink: '/' },
      { label: 'Banco', routerLink: '/Home/banco' },
      { label: 'Ver Cuentas' }
    ]);
    this.bS.currentBreadcrumbs$.subscribe(bc => {
      this.items = bc;
  })
  this.router.navigate(['/Home/banco/cuentas'], {
    queryParams: { 
      idBanco: banco.ban01IdBanco, 
      descripcion: banco.ban01Descripcion 
    }
  });
    // Luego, navega a la ruta correspondiente de "Ver Cuentas"
    //this.router.navigate([`/Home/banco/${banco.ban01IdBanco}/cuentas/${banco.ban01Descripcion}`]);
  }

  llenarData() {
    this.bancoService.GetBancos().subscribe(bancos => {
      this.bancos = bancos;
      this.originalBancos = this.bancos
    }, error => {
      this.mostrarMensaje('Error al cargar bancos.');
      console.error(error);
    });
  }


  guardar() {
    if (this.formBanco.invalid) {
      this.formBanco.markAllAsTouched(); // Marca todos los campos como tocados
      this.mostrarMensaje('Por favor, complete todos los campos requeridos.');
      return;
    }

    if (this.selectedBanco) {
      // Actualización
      this.bancoService.ActualizarBanco(
        this.formBanco.value
      ).subscribe(
        response => {

          this.mostrarMensaje('El Banco se ha actualizado correctamente.');
          this.llenarData();
          this.resetFormulario();
        },
        error => {
          this.mostrarMensaje('Error al actualizar banco.');
          console.error('Error al actualizar banco', error);
        }
      );
    } else {
      // Creación
      this.bancoService.CrearBanco(this.formBanco.value).subscribe(
        response => {
          this.mostrarMensaje('El Banco se ha creado correctamente.');
          this.llenarData();
          this.resetFormulario();
        },
        error => {
          this.mostrarMensaje('Error al crear banco.');
          console.error('Error al crear banco', error);
        }
      );
    }

    this.visible = false; // Cerrar el modal
  }

  // eliminar
  confirmarEliminacion(banco: Banco) {
    this.selectedBanco = banco;
    this.displayDialog = true;
  }

  cancelarEliminacion() {
    this.displayDialog = false; // Cerrar el diálogo sin hacer nada
  }

  eliminarBanco() {
    if (this.selectedBanco) {
      this.bancoService.EliminarBanco(this.selectedBanco.ban01Empresa, this.selectedBanco.ban01IdBanco).subscribe(
        () => {
          this.mostrarMensaje(`${this.selectedBanco.ban01Descripcion} ha sido eliminado correctamente.`);
          this.llenarData(); // Actualizar los datos
          this.displayDialog = false; // Cerrar el diálogo
        },
        error => {
          if (error.error && error.error.message) {
            this.mostrarMensaje(error.error.message); // Mostrar el mensaje de error
          } else {
            this.mostrarMensaje('Error al eliminar banco');
          }
          console.error('Error al eliminar banco', error);
          this.displayDialog = false; // Cerrar el diálogo en caso de error
        }
      );
    }
  }

  mostrarMensaje(mensaje: string) {
    this.mensajeModal = mensaje;
    this.mostrarMensajeModal = true;
  }

  cerrarModal() {
    this.mostrarMensajeModal = false;
    this.visible = false;
  }
  cerrarModalMensaje() {
    this.mostrarMensajeModal = false;
  }

  VerCrearRegistro() {
    this.resetFormulario();
    this.selectedBanco = null;
    this.visible = true;
  }
  VerActualizarRegistro(banco: Banco) {
    // Cargar datos seleccionados en el formulario
    this.formBanco.patchValue(banco);
    this.selectedBanco = banco; // Set the selected bank manually
    this.visible = true; // Mostrar el modal de edición
  }


  selectBanco(banco: Banco) {
    this.selectedBanco = banco;
  };
  onFilter(filterValue: string) {
    if (filterValue) {
      const searchTerm = filterValue.toLowerCase();
      this.bancos = this.originalBancos.filter(b => {
        const nombre = b.ban01Descripcion.toLowerCase();
        const codigo = b.ban01IdBanco.toLowerCase();
        return nombre.includes(searchTerm) || codigo.includes(searchTerm);
      });
    } else {
      this.bancos = [...this.originalBancos];
    }
  }

  resetFormulario() {
    this.formBanco.reset(); // Limpia el formulario
    this.selectedBanco = null; // Limpia la selección
    this.visible = false; // Asegura que el modal se cierre
  }


  /*VerCuentaBancaria(){

    this.displayDialog = true;

  }*/




}
