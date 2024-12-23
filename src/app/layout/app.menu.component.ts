import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../demo/components/service/app.layout.service';
import { RouterLink } from '@angular/router';
import { PermisosxPerfilService } from '../demo/service/permisosxperfil.service';
import { PermisosxPerfil } from '../demo/api/permisosxperfil';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    constructor(
        public permisosService: PermisosxPerfilService,
        layoutService: LayoutService
    ) {}

    model: any[] = [];
    permisos: PermisosxPerfil[] = []; // Lista para almacenar los resultados

    ngOnInit() {
        // Llama al método para obtener permisos al inicializar el componente
        this.permisosService.GetPermisosxperfil('03', '01').subscribe({
            next: (data) => {
                this.permisos = data; // Asigna los datos obtenidos al array permisos
                //console.log(this.permisos);
                this.loadMenu(this.permisos)
                
            },
            error: (error) => {
                console.error('Error al obtener datos de permisos:', error);
            },
        });
    }

    loadMenu(permisos: PermisosxPerfil[]){
        // Paso 1: Clasificar elementos por niveles
        const nivel1 = this.permisos.filter((element) =>
            element.codigoFormulario.endsWith('0000')
        );
        const nivel2 = this.permisos.filter(
            (element) =>
                element.codigoFormulario.endsWith('00') &&
                !element.codigoFormulario.endsWith('0000')
        );
        const nivel3 = this.permisos.filter(
            (element) => !element.codigoFormulario.endsWith('00')
        );

        // Paso 2: Construir la jerarquía del menú
        this.model = nivel1.map((l1) => {
            // Encontrar elementos de nivel 2 asociados al nivel 1 actual
            const subItemsNivel2 = nivel2
                .filter((l2) =>
                    l2.codigoFormulario.startsWith(
                        l1.codigoFormulario.substring(0, 2)
                    )
                )
                .map((l2) => {
                    // Encontrar elementos de nivel 3 asociados al nivel 2 actual
                    const subItemsNivel3 = nivel3
                        .filter((l3) =>
                            l3.codigoFormulario.startsWith(
                                l2.codigoFormulario.substring(0, 4)
                            )
                        )
                        .map((l3) => ({
                            label: l3.etiqueta,
                            icon: l3.nombreIcono,
                            routerLink: [`/landing`],
                        }));

                    return {
                        label: l2.etiqueta,
                        icon: l2.nombreIcono,
                        routerLink:
                            subItemsNivel3.length === 0
                                ? [`/landing`]
                                : null,
                        items:
                            subItemsNivel3.length > 0
                                ? subItemsNivel3
                                : null,
                    };
                });

            return {
                label: l1.etiqueta,
                icon: l1.nombreIcono,
                items:
                    subItemsNivel2.length > 0 ? subItemsNivel2 : null,
            };
        });

    }
}
