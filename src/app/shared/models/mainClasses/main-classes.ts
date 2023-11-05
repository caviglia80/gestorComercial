export class Inventario {
  id: number;
  idExterno: string;
  nombre: string;
  existencias?: number;
  costo: number;
  margenBeneficio: number;
  tipo: string;
  proveedor?: string;
  duracion?: string;
  categoria?: string;
  descripcion?: string;

  constructor(
    id = 0,
    idExterno = '',
    nombre = '',
    existencias = 0,
    costo = 0,
    margenBeneficio = 0,
    tipo = '',
    proveedor = '',
    duracion = '',
    categoria = '',
    descripcion = '',
  ) {
    this.id = id;
    this.idExterno = idExterno;
    this.nombre = nombre;
    this.existencias = existencias;
    this.costo = costo;
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
    id = 0,
    username = '',
    fullname = '',
    position = '',
    phone = '',
    email = '',
    password = ''
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
    id = 0,
    name = '',
    menus = '',
    permits = '',
    description = ''
  ) {
    this.id = id;
    this.name = name;
    this.menus = menus;
    this.permits = permits;
    this.description = description;
  }
}

export class proveedor {
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
    id = 0,
    company = '',
    contactFullname = '',
    phone = '',
    email = '',
    address = '',
    website = '',
    accountNumber = '',
    supply = '',
    observation = ''
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
  idInventario?: string;
  currency?: string;
  amount?: number;
  margenBeneficio?: number;
  method?: string;
  category: string;
  invoice?: string;
  anulado?: string;
  cliente?: string;
  description?: string;

  constructor(
    id = 0,
    date = '',
    idInventario = '',
    currency = '',
    amount = 0,
    margenBeneficio = 0,
    method = '',
    category = '',
    invoice = '',
    anulado = '0',
    cliente = '',
    description = ''
  ) {
    this.id = id;
    this.date = date;
    this.idInventario = idInventario;
    this.currency = currency;
    this.amount = amount;
    this.margenBeneficio = margenBeneficio;
    this.method = method;
    this.category = category;
    this.invoice = invoice;
    this.anulado = anulado;
    this.cliente = cliente;
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
    id = 0,
    date = '',
    currency = '',
    amount = 0,
    method = '',
    category = '',
    invoice = '',
    beneficiary_provider = '',
    description = ''
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
    id = 1,
    cuit = '',
    sign = '',
    token = '',
    expirationTime = '',
    uniqueId = '',
    certificado = '',
    llave = ''
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
  permitirStockCeroEnabled: string;
  titulo: string;

  constructor(
    id = 1,
    icono = 'assets/defaultLogo.png',
    copyEnabled = '1',
    color1 = '#846bf3',
    color2 = '#4c28ec',
    ingresoRapidoEnabled = '1',
    egresoRapidoEnabled = '1',
    ingresoRestaStockEnabled = '1',
    notificacionesEnabled = '1',
    ingresoAnuladoSumaStockEnabled = '1',
    permitirStockCeroEnabled = '0',
    titulo = 'Gestor Comercial'
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
    this.permitirStockCeroEnabled = permitirStockCeroEnabled;
    this.notificacionesEnabled = notificacionesEnabled;
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
    id = 0,
    name = '',
    cantidadIngresos = '0',
    totalIngresos = '0',
    margenGanancias = '0',
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
    rubro = '',
    cantidadEgresos = '0',
    montoTotalEgresos = '0'
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
    bp = '',
    cantidadEgresos = '0',
    montoTotalEgresos = '0'
  ) {
    this.bp = bp;
    this.cantidadEgresos = cantidadEgresos;
    this.montoTotalEgresos = montoTotalEgresos;
  }
}
