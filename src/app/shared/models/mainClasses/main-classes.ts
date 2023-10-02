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
  id: number;
  date: string;
  currency: string;
  amount: number;
  paymentMethod: string;
  category: string;
  invoice: string;
  description: string;

  constructor(
    id: number = 0,
    date: string = '',
    currency: string = '',
    amount: number = 0,
    paymentMethod: string = '',
    category: string = '',
    invoice: string = '',
    description: string = ''
  ) {
    this.id = id;
    this.date = date;
    this.currency = currency;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.category = category;
    this.invoice = invoice;
    this.description = description;
  }
}

export class moneyOutlays {
  id: number;
  date: string;
  currency: string;
  amount: number;
  expenseMethod: string;
  category: string;
  invoice: string;
  beneficiary_provider: string;
  description: string;

  constructor(
    id: number = 0,
    date: string = '',
    currency: string = '',
    amount: number = 0,
    expenseMethod: string = '',
    category: string = '',
    invoice: string = '',
    beneficiary_provider: string = '',
    description: string = ''
  ) {
    this.id = id;
    this.date = date;
    this.currency = currency;
    this.amount = amount;
    this.expenseMethod = expenseMethod;
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
  tooltipEnabled: number;
  copyEnabled: number;
  colors: string;

  constructor(
    id: number = 1,
    icono: string = 'assets/defaultLogo.png',
    tooltipEnabled: number = 1,
    copyEnabled: number = 1,
    colors: string = '',
  ) {
    this.id = id;
    this.icono = icono;
    this.tooltipEnabled = tooltipEnabled;
    this.copyEnabled = copyEnabled;
    this.colors = colors;
  }
}
