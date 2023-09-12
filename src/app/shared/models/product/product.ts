export class Product {
  id: number;
  name: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  observacion: string;
  ventasRealizadas: number;

  constructor(
    id: number = 0,
    name: string = '',
    stock: number = 0,
    buyPrice: number = 0,
    sellPrice: number = 0,
    observacion: string = '',
    ventasRealizadas: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.stock = stock;
    this.buyPrice = buyPrice;
    this.sellPrice = sellPrice;
    this.observacion = observacion;
    this.ventasRealizadas = ventasRealizadas;
  }
}
