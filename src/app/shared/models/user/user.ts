export class User {
  id: number;
  name: string;
  surname: string;
  cellphone: string;
  email: string;
  password: string;
  roles: string[];

  constructor(
    id: number = 0,
    name: string = '',
    surname: string = '',
    cellphone: string = '',
    email: string = '',
    password: string = '',
    roles: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.cellphone = cellphone;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
