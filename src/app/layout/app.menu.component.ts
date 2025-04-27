import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../demo/components/service/app.layout.service';
import { PermisosxPerfil } from '../demo/model/permisosxperfil';
import { LoginService } from '../demo/service/login.service';
import { MenuxPerfil } from '../demo/model/MenuxPerfil';
import { GlobalService } from '../demo/service/global.service';
import { ConfigService } from '../demo/service/config.service';
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    codigoPerfil : string= '';
    codigoModulo : string = '';
    constructor(
        public permisosService: LoginService,
        layoutService: LayoutService,
        public gS: GlobalService,
        configService :ConfigService
    ) {
        this.selectedDate = new Date();
        this.codigoModulo = configService.getCodigoModulo();
        this.codigoPerfil = gS.getCodigoPerfil();
        // console.log("datos de modulo y perfil");
        // console.log(this.codigoModulo);
        // console.log(this.codigoPerfil);
    }

    selectedDate: Date = new Date();

    model: any[] = [];
    //permisos: MenuxPerfil[] = []; // Lista para almacenar los resultados
    permisos: MenuxPerfil;
    ngOnInit() {
        // Llama al método para obtener permisos al inicializar el componente
        this.permisosService.TraerMenuxPerfil(this.codigoPerfil,
            this.codigoModulo).subscribe({
            next: (data) => {
                var datosMenu = data.data;

                //console.log(this.permisos);

                this.loadMenu(datosMenu);
            },
            error: (error) => {
                console.error('Error al obtener datos de permisos:', error);
            },
        });
    }

    onDateSelect(date: Date) {
        this.gS.updateSelectedDate(date);
    }

    loadMenu(menuAsignados: PermisosxPerfil[]) {
        // Paso 1: Clasificar elementos por niveles
        const nivel1 = menuAsignados.filter((element) =>
            element.codigoFormulario.endsWith('0000')
        );
        const nivel2 = menuAsignados.filter(
            (element) =>
                element.codigoFormulario.endsWith('00') &&
                !element.codigoFormulario.endsWith('0000')
        );
        const nivel3 = menuAsignados.filter(
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
                            routerLink: [
                                `/Home/${l2.nombreFormulario}/${l3.nombreFormulario}`,
                            ],
                        }));

                    return {
                        label: l2.etiqueta,
                        icon: l2.nombreIcono,
                        routerLink:
                            subItemsNivel3.length === 0
                                ? [`/Home/${l2.nombreFormulario}`]
                                : null,
                        items:
                            subItemsNivel3.length > 0 ? subItemsNivel3 : null,
                    };
                });

            return {
                label: l1.etiqueta,
                items: subItemsNivel2.length > 0 ? subItemsNivel2 : null,
            };
        });
    }
}

/**


this.model = [
            {
                label: 'Home',
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/Home'] },
                    {label:'Banco' , icon:'pi pi-fw pi-building', routerLink:['banco']},
                    {label:'Cuentas Bancarias' , icon:'pi pi-fw pi-credit-card', routerLink:['cuentas_bancarias']},
                    {label:'Usuario' , icon:'pi pi-fw pi-user', routerLink:['usuario']}
                ]



 */
