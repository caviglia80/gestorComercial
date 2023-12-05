import { Injectable } from '@angular/core';

interface Menu {
  ruta: string;
  nombre: string;
  habilitado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userRoles: Menu[];

  constructor() {
    this.userRoles = [
      { "ruta": "/nav/dashboard", "nombre": "Panel", "habilitado": true },
      { "ruta": "/nav/ingresos", "nombre": "Ingresos", "habilitado": false },
      { "ruta": "/nav/egresos", "nombre": "Egresos", "habilitado": false },
      { "ruta": "/nav/inventario", "nombre": "Inventario", "habilitado": false },
      { "ruta": "/nav/proveedores", "nombre": "Proveedores", "habilitado": false },
      { "ruta": "/nav/reportes", "nombre": "Reportes", "habilitado": false },
      { "ruta": "/nav/general", "nombre": "General", "habilitado": false },
      { "ruta": "/nav/usuarios", "nombre": "Usuarios", "habilitado": false },
      { "ruta": "/nav/roles", "nombre": "Roles", "habilitado": false }
    ];
  }

  canAccess(ruta: string): boolean {
    return this.userRoles.some(menu => menu.ruta === ruta && menu.habilitado);
  }

  getFirstEnabledRoute(): string {
    const firstEnabledMenu = this.userRoles.find(menu => menu.habilitado);
    return firstEnabledMenu ? firstEnabledMenu.ruta : '/nav/inicio';
  }
}
