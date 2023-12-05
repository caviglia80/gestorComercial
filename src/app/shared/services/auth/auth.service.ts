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
      { "ruta": "/nav/ingresos", "nombre": "Ingresos", "habilitado": true },
      { "ruta": "/nav/egresos", "nombre": "Egresos", "habilitado": true },
      { "ruta": "/nav/inventario", "nombre": "Inventario", "habilitado": true },
      { "ruta": "/nav/proveedores", "nombre": "Proveedores", "habilitado": true },
      { "ruta": "/nav/reportes", "nombre": "Reportes", "habilitado": true },
      { "ruta": "/nav/general", "nombre": "General", "habilitado": true },
      { "ruta": "/nav/usuarios", "nombre": "Usuarios", "habilitado": true },
      { "ruta": "/nav/roles", "nombre": "Roles", "habilitado": true }
    ];
  }

  canAccess(ruta: string): boolean {
    return this.userRoles.some(menu => menu.ruta === ruta && menu.habilitado);
  }
}
