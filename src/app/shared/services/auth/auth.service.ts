import { Injectable } from '@angular/core';

interface Menu {
  id: string;
  name: string;
  habilitado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userRoles: Menu[]; // Aquí userRoles es un arreglo de objetos Menu

  constructor() {
    this.userRoles = [
      { "id": "1", "name": "Panel", "habilitado": false },
      { "id": "2", "name": "Ingresos", "habilitado": true },
      { "id": "3", "name": "Egresos", "habilitado": false },
      { "id": "4", "name": "Inventario", "habilitado": false },
      { "id": "5", "name": "Proveedores", "habilitado": false },
      { "id": "6", "name": "Reportes", "habilitado": false },
      { "id": "7", "name": "General", "habilitado": false },
      { "id": "8", "name": "Usuarios", "habilitado": false },
      { "id": "9", "name": "Roles", "habilitado": false }
    ];
  }

  canAccess(menuId: string): boolean {
    return this.userRoles.some(menu => menu.id === menuId && menu.habilitado);
  }
}
