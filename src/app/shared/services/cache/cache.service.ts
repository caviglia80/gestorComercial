import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private time: number = 60 * 3; // segundos
  private cache: Map<string, { data: any; expiresAt: number }> = new Map<string, { data: any; expiresAt: number }>();

  constructor() { }

  // Agregar un valor a la caché con un tiempo de vida (en segundos)
  set(key: string, value: any, expiresIn: number = this.time): void {
    const expiresAt = Date.now() + expiresIn * 1000;
    this.cache.set(key, { data: value, expiresAt });
  }

  // Obtener un valor de la caché y verificar si ha expirado
  get(key: string): any | null {
    const cachedData = this.cache.get(key);
    if (cachedData && cachedData.expiresAt >= Date.now()) {
      return cachedData.data;
    } else {
      // Eliminar datos caducados de la caché
      this.cache.delete(key);
      return null;
    }
  }

  // Eliminar un valor de la caché
  remove(key: string): void {
    this.cache.delete(key);
  }

  // Verificar si una clave existe en la caché, sus datos, y no esta vencida
  has(key: string): boolean {
    const cachedData = this.cache.get(key);
    return !!cachedData && !!cachedData.data && cachedData.expiresAt >= Date.now();
  }

  // Limpiar la caché por completo
  clear(): void {
    this.cache.clear();
  }
}
