export class Inventario {
  id: number;
  empresaId?: number;
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
    empresaId = 0,
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
    this.empresaId = empresaId;
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

export class Usuario {
  id?: number;
  empresaId?: number;
  rolId?: number;
  isNewAdmin?: string;
  administrador?: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  password: string;
  isSa?: string;

  constructor(
    id = 0,
    empresaId = 0,
    rolId = 0,
    isNewAdmin = '0',
    administrador = '0',
    username = '',
    fullname = '',
    phone = '',
    email = '',
    password = '',
    isSa = '0',
  ) {
    this.id = id;
    this.empresaId = empresaId;
    this.rolId = rolId;
    this.isNewAdmin = isNewAdmin;
    this.administrador = administrador;
    this.username = username;
    this.fullname = fullname;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.isSa = isSa;
  }
}

export class Rol {
  id: number;
  empresaId?: number;
  nombre: string;
  menus: string;
  permisos?: string;
  descripcion: string;

  constructor(
    id = 0,
    empresaId = 0,
    nombre = '',
    menus = '',
    permisos = '',
    descripcion = ''
  ) {
    this.id = id;
    this.empresaId = empresaId;
    this.nombre = nombre;
    this.menus = menus;
    this.permisos = permisos;
    this.descripcion = descripcion;
  }
}

export class proveedor {
  id: number;
  empresaId?: number;
  company: string;
  contactFullname: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  accountNumber: string;
  tipoSuministro: string;
  observation: string;

  constructor(
    id = 0,
    empresaId = 0,
    company = '',
    contactFullname = '',
    phone = '',
    email = '',
    address = '',
    website = '',
    accountNumber = '',
    tipoSuministro = '',
    observation = ''
  ) {
    this.id = id;
    this.empresaId = empresaId;
    this.company = company;
    this.contactFullname = contactFullname;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.website = website;
    this.accountNumber = accountNumber;
    this.tipoSuministro = tipoSuministro;
    this.observation = observation;
  }
}

export class Ingreso {
  id?: number;
  empresaId?: number;
  date: string;
  nombre?: string;
  inventarioId?: number;
  moneda?: string;
  monto?: number;
  costo?: number;
  margenBeneficio?: number;
  method?: string;
  category: string;
  comprobante?: string;
  anulado?: string;
  cliente?: string;
  description?: string;

  constructor(
    id = 0,
    empresaId = 0,
    date = '',
    nombre = '',
    inventarioId = 0,
    moneda = '',
    monto = 0,
    costo = 0,
    margenBeneficio = 0,
    method = '',
    category = '',
    comprobante = '',
    anulado = '0',
    cliente = '',
    description = ''
  ) {
    this.id = id;
    this.empresaId = empresaId;
    this.date = date;
    this.nombre = nombre;
    this.inventarioId = inventarioId;
    this.moneda = moneda;
    this.monto = monto;
    this.costo = costo;
    this.margenBeneficio = margenBeneficio;
    this.method = method;
    this.category = category;
    this.comprobante = comprobante;
    this.anulado = anulado;
    this.cliente = cliente;
    this.description = description;
  }
}

export class Egreso {
  id?: number;
  empresaId?: number;
  date: string;
  moneda?: string;
  monto: number;
  method?: string;
  category: string;
  comprobante?: string;
  beneficiario?: string;
  description?: string;

  constructor(
    id = 0,
    empresaId = 0,
    date = '',
    moneda = '',
    monto = 0,
    method = '',
    category = '',
    comprobante = '',
    beneficiario = '',
    description = ''
  ) {
    this.id = id;
    this.empresaId = empresaId;
    this.date = date;
    this.moneda = moneda;
    this.monto = monto;
    this.method = method;
    this.category = category;
    this.comprobante = comprobante;
    this.beneficiario = beneficiario;
    this.description = description;
  }
}

//export class facturacionAuth {
//  id: number;
//  empresaId: number;
//  cuit: string | null;
//  sign: string | null;
//  token: string | null;
//  expirationTime: string | null;
//  uniqueId: string | null;
//  certificado: string | null;
//  llave: string | null;
//
//  constructor(
//    id = 1,
//    empresaId = 0,
//    cuit = '',
//    sign = '',
//    token = '',
//    expirationTime = '',
//    uniqueId = '',
//    certificado = '',
//    llave = ''
//  ) {
//    this.id = id;
//    this.empresaId = empresaId;
//    this.cuit = cuit;
//    this.sign = sign;
//    this.token = token;
//    this.expirationTime = expirationTime;
//    this.uniqueId = uniqueId;
//    this.certificado = certificado;
//    this.llave = llave;
//  }
//}

export class empresa {
  id: number;
  usuarioId: number | null;
  nombre: string;
  fechaVencimiento: string | null;
  icono?: string;
  copyEnabled?: string;
  color1?: string;
  color2?: string;
  ingresoRapidoEnabled?: string;
  egresoRapidoEnabled?: string;
  ingresoRestaStockEnabled?: string;
  ingresoAnuladoSumaStockEnabled?: string;
  permitirStockCeroEnabled?: string;
  validarInventarioEnabled?: string;

  constructor(
    id = 0,
    usuarioId = null,
    nombre = 'Compy',
    fechaVencimiento = null,
    icono = 'assets/img/logo.png',
    copyEnabled = '1',
    color1 = '#846bf3',
    color2 = '#4c28ec',
    ingresoRapidoEnabled = '1',
    egresoRapidoEnabled = '1',
    ingresoRestaStockEnabled = '1',
    ingresoAnuladoSumaStockEnabled = '1',
    permitirStockCeroEnabled = '0',
    validarInventarioEnabled = '1',
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.nombre = nombre;
    this.fechaVencimiento = fechaVencimiento;
    this.icono = icono;
    this.copyEnabled = copyEnabled;
    this.color1 = color1;
    this.color2 = color2;
    this.ingresoRapidoEnabled = ingresoRapidoEnabled;
    this.egresoRapidoEnabled = egresoRapidoEnabled;
    this.ingresoRestaStockEnabled = ingresoRestaStockEnabled;
    this.ingresoAnuladoSumaStockEnabled = ingresoAnuladoSumaStockEnabled;
    this.permitirStockCeroEnabled = permitirStockCeroEnabled;
    this.validarInventarioEnabled = validarInventarioEnabled;
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

export class Venta {
  empresaId?: number;
  ingresos?: string;
  comprobante?: string;
  fecha?: string;

  constructor(
    empresaId = 0,
    ingresos = '',
    comprobante = '',
    fecha = '',
  ) {
    this.empresaId = empresaId;
    this.ingresos = ingresos;
    this.comprobante = comprobante;
    this.fecha = fecha;
  }
}
