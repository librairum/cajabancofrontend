import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../demo/components/service/app.layout.service';
import { PermisosxPerfil } from '../demo/model/permisosxperfil';
import { LoginService } from '../demo/service/login.service';
import { MenuxPerfil } from '../demo/model/MenuxPerfil';
import { GlobalService } from '../demo/service/global.service';

interface MenuItem {
    label: string;
    icon?: string;
    routerLink?: any[];
    items?: MenuItem[] | null;
}

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    selectedDate: Date = new Date();
    model: MenuItem[] = [];
    permisos: MenuxPerfil;

    constructor(
        public permisosService: LoginService,
        layoutService: LayoutService,
        public gS: GlobalService
    ) {
        this.selectedDate = new Date();
    }

    ngOnInit() {
        this.permisosService.TraerMenuxPerfil('03', '01').subscribe({
            next: (data) => {
                const datosMenu: PermisosxPerfil[] = data.data;
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
        const nivel1Map = new Map<string, PermisosxPerfil>();
        const nivel2Map = new Map<string, PermisosxPerfil[]>();
        const nivel3Map = new Map<string, PermisosxPerfil[]>();

        // Clasificar elementos por niveles
        menuAsignados.forEach((item) => {
            const code = item.codigoFormulario;
            if (code.endsWith('0000')) {
                nivel1Map.set(code, item);
            } else if (code.endsWith('00')) {
                const parentCode = code.substring(0, 2) + '0000';
                if (!nivel2Map.has(parentCode)) {
                    nivel2Map.set(parentCode, []);
                }
                nivel2Map.get(parentCode)!.push(item);
            } else {
                const parentCode = code.substring(0, 4) + '00';
                if (!nivel3Map.has(parentCode)) {
                    nivel3Map.set(parentCode, []);
                }
                nivel3Map.get(parentCode)!.push(item);
            }
        });

        const menuItems: MenuItem[] = [];

        nivel1Map.forEach((l1Item, l1Code) => {
            const nivel2Items = nivel2Map.get(l1Code) || [];

            const subItemsNivel2: MenuItem[] = nivel2Items.map((l2Item) => {
                const l2Code = l2Item.codigoFormulario;
                const nivel3Items = nivel3Map.get(l2Code) || [];

                const subItemsNivel3: MenuItem[] = nivel3Items.map((l3Item) => ({
                    label: l3Item.etiqueta,
                    icon: l3Item.nombreIcono,
                    routerLink: [`/Home/${l2Item.nombreFormulario}/${l3Item.nombreFormulario}`],
                }));

                return {
                    label: l2Item.etiqueta,
                    icon: l2Item.nombreIcono,
                    routerLink: subItemsNivel3.length === 0 ? [`/Home/${l2Item.nombreFormulario}`] : null,
                    items: subItemsNivel3.length > 0 ? subItemsNivel3 : null,
                };
            });

            // Insertar "Perfil" como apartado separado debajo de "Usuario"
            const usuarioIndex = subItemsNivel2.findIndex(
                (item) => item.label.toLowerCase() === 'usuario'
            );

            if (usuarioIndex !== -1) {
                const perfilItemData = nivel2Items.find(
                    (item) => item.etiqueta.toLowerCase() === 'perfil'
                );

                let perfilMenuItem: MenuItem;

                if (perfilItemData) {
                    perfilMenuItem = {
                        label: perfilItemData.etiqueta,
                        icon: perfilItemData.nombreIcono,
                        routerLink: [`/Home/${perfilItemData.nombreFormulario}`],
                    };
                } else {
                    // Si no existe en datos, crear manualmente (ajusta icono y ruta si quieres)
                    perfilMenuItem = {
                        label: 'Perfil',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/Home/perfil'],
                    };
                }

                subItemsNivel2.splice(usuarioIndex + 1, 0, perfilMenuItem);
            }

            menuItems.push({
                label: l1Item.etiqueta,
                items: subItemsNivel2.length > 0 ? subItemsNivel2 : null,
            });
        });

        this.model = menuItems;
    }
}
