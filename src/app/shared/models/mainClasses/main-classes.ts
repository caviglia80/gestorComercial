export class Producto {
  id: number;
  idExterno?: string;
  nombre: string;
  existencias?: number;
  precio: number;
  margenBeneficio?: number;
  tipo: string;
  proveedor?: string;
  duracion?: string;
  categoria?: string;
  descripcion?: string;

  constructor(
    id: number = 0,
    idExterno: string = '',
    nombre: string = '',
    existencias: number = 0,
    precio: number = 0,
    margenBeneficio: number = 0,
    tipo: string = '',
    proveedor: string = '',
    duracion: string = '',
    categoria: string = '',
    descripcion: string = '',
  ) {
    this.id = id;
    this.idExterno = idExterno;
    this.nombre = nombre;
    this.existencias = existencias;
    this.precio = precio;
    this.margenBeneficio = margenBeneficio;
    this.tipo = tipo;
    this.proveedor = proveedor;
    this.duracion = duracion;
    this.categoria = categoria;
    this.descripcion = descripcion;
  }
}

export class User {
  id: number;
  username: string;
  fullname: string;
  position: string;
  phone: string;
  email: string;
  password: string;

  constructor(
    id: number = 0,
    username: string = '',
    fullname: string = '',
    position: string = '',
    phone: string = '',
    email: string = '',
    password: string = ''
  ) {
    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.position = position;
    this.phone = phone;
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

export class supplier {
  id: number;
  company: string;
  contactFullname: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  accountNumber: string;
  supply: string;
  observation: string;

  constructor(
    id: number = 0,
    company: string = '',
    contactFullname: string = '',
    phone: string = '',
    email: string = '',
    address: string = '',
    website: string = '',
    accountNumber: string = '',
    supply: string = '',
    observation: string = ''
  ) {
    this.id = id;
    this.company = company;
    this.contactFullname = contactFullname;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.website = website;
    this.accountNumber = accountNumber;
    this.supply = supply;
    this.observation = observation;
  }
}

export class moneyIncome {
  id?: number;
  date: string;
  product?: string;
  currency?: string;
  amount?: number;
  method?: string;
  category: string;
  invoice?: string;
  anulado?: string;
  cliente?: string;
  pvpPorcentaje?: string;
  description?: string;

  constructor(
    id: number = 0,
    date: string = '',
    product: string = '',
    currency: string = '',
    amount: number = 0,
    method: string = '',
    category: string = '',
    invoice: string = '',
    anulado: string = '0',
    cliente: string = '',
    pvpPorcentaje: string = '0',
    description: string = ''
  ) {
    this.id = id;
    this.date = date;
    this.product = product;
    this.currency = currency;
    this.amount = amount;
    this.method = method;
    this.category = category;
    this.invoice = invoice;
    this.anulado = anulado;
    this.cliente = cliente;
    this.pvpPorcentaje = pvpPorcentaje;
    this.description = description;
  }
}

export class moneyOutlays {
  id?: number;
  date: string;
  currency?: string;
  amount: number;
  method?: string;
  category: string;
  invoice?: string;
  beneficiary_provider?: string;
  description?: string;

  constructor(
    id: number = 0,
    date: string = '',
    currency: string = '',
    amount: number = 0,
    method: string = '',
    category: string = '',
    invoice: string = '',
    beneficiary_provider: string = '',
    description: string = ''
  ) {
    this.id = id;
    this.date = date;
    this.currency = currency;
    this.amount = amount;
    this.method = method;
    this.category = category;
    this.invoice = invoice;
    this.beneficiary_provider = beneficiary_provider;
    this.description = description;
  }
}

export class facturacionAuth {
  id: number;
  cuit: string | null;
  sign: string | null;
  token: string | null;
  expirationTime: string | null;
  uniqueId: string | null;
  certificado: string | null;
  llave: string | null;

  constructor(
    id: number = 1,
    cuit: string = '',
    sign: string = '',
    token: string = '',
    expirationTime: string = '',
    uniqueId: string = '',
    certificado: string = '',
    llave: string = ''
  ) {
    this.id = id;
    this.cuit = cuit;
    this.sign = sign;
    this.token = token;
    this.expirationTime = expirationTime;
    this.uniqueId = uniqueId;
    this.certificado = certificado;
    this.llave = llave;
  }
}

export class configuracion {
  id: number;
  icono: string;
  copyEnabled: string;
  color1: string;
  color2: string;
  ingresoRapidoEnabled: string;
  egresoRapidoEnabled: string;
  ingresoRestaStockEnabled: string;
  notificacionesEnabled: string;
  ingresoAnuladoSumaStockEnabled: string;
  pvpPorcentaje: string;
  titulo: string;

  constructor(
    id: number = 1,
    icono: string = 'assets/defaultLogo.png',
    copyEnabled: string = '1',
    color1: string = '#846bf3',
    color2: string = '#4c28ec',
    ingresoRapidoEnabled: string = '1',
    egresoRapidoEnabled: string = '1',
    ingresoRestaStockEnabled: string = '1',
    notificacionesEnabled: string = '1',
    ingresoAnuladoSumaStockEnabled: string = '1',
    pvpPorcentaje: string = '0',
    titulo: string = 'Gestor Comercial'
  ) {
    this.id = id;
    this.icono = icono;
    this.copyEnabled = copyEnabled;
    this.color1 = color1;
    this.color2 = color2;
    this.ingresoRapidoEnabled = ingresoRapidoEnabled;
    this.egresoRapidoEnabled = egresoRapidoEnabled;
    this.ingresoRestaStockEnabled = ingresoRestaStockEnabled;
    this.ingresoAnuladoSumaStockEnabled = ingresoAnuladoSumaStockEnabled;
    this.notificacionesEnabled = notificacionesEnabled;
    this.pvpPorcentaje = pvpPorcentaje;
    this.titulo = titulo;
  }
}

export class reportesIngresos {
  id: number;
  name: string;
  cantidadIngresos: string;
  totalIngresos: string;
  margenGanancias: string;

  constructor(
    id: number = 0,
    name: string = '',
    cantidadIngresos: string = '0',
    totalIngresos: string = '0',
    margenGanancias: string = '0',
  ) {
    this.id = id;
    this.name = name;
    this.cantidadIngresos = cantidadIngresos;
    this.totalIngresos = totalIngresos;
    this.margenGanancias = margenGanancias;
  }
}

export class reportesEgresosRubro {
  rubro: string;
  cantidadEgresos: string;
  montoTotalEgresos: string;

  constructor(
    rubro: string = '',
    cantidadEgresos: string = '0',
    montoTotalEgresos: string = '0'
  ) {
    this.rubro = rubro;
    this.cantidadEgresos = cantidadEgresos;
    this.montoTotalEgresos = montoTotalEgresos;
  }
}

export class reportesEgresosBP {
  bp: string;
  cantidadEgresos: string;
  montoTotalEgresos: string;

  constructor(
    bp: string = '',
    cantidadEgresos: string = '0',
    montoTotalEgresos: string = '0'
  ) {
    this.bp = bp;
    this.cantidadEgresos = cantidadEgresos;
    this.montoTotalEgresos = montoTotalEgresos;
  }
}
