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

export class User {
  id: number;
  username: string;
  fullname: string;
  position: string;
  cellphone: string;
  email: string;
  password: string

  constructor(
    id: number = 0,
    username: string = '',
    fullname: string = '',
    position: string = '',
    cellphone: string = '',
    email: string = '',
    password: string = ''
  ) {
    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.position = position;
    this.cellphone = cellphone;
    this.email = email;
    this.password = password;
  }
}

export class Role {
  id: number;
  name: string;
  menus: string;
  permits: string;
  description: string;

  constructor(
    id: number = 0,
    name: string = '',
    menus: string = '',
    permits: string = '',
    description: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.menus = menus;
    this.permits = permits;
    this.description = description;
  }
}
