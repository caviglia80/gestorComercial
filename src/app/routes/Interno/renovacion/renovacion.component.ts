import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { empresa, Usuario } from '@models/mainClasses/main-classes';
import { GlobalVariables } from 'src/app/app.component';
import { SharedService } from '@services/shared/shared.service';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-renovacion',
  templateUrl: './renovacion.component.html',
  styleUrls: ['./renovacion.component.css']
})
export class RenovacionComponent implements OnInit {
  public fechaVencimiento: String = '00-00-0000';
  public dataEmpresa: empresa = new empresa();

  public fechaOk: boolean = false;
  public fechaCercaVencimiento: boolean = false;
  public fechaPorVencerOvencido: boolean = false;

  public usuario: Usuario | undefined = new Usuario();
  public usuarios: Usuario[] = [];

  constructor(
    private authService: AuthService,
    private cacheService: CacheService,
    public sharedService: SharedService,
    public dataService: DataService
  ) { }

  async ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data) {
        this.dataEmpresa = data;
        if (this.dataEmpresa.fechaVencimiento) {
          this.comprobarVencimiento(this.dataEmpresa.fechaVencimiento);
          this.fechaVencimiento = this.sharedService.fechaFormateada(this.dataEmpresa.fechaVencimiento);
        } else {
          this.fechaOk = false;
          this.fechaCercaVencimiento = false;
          this.fechaPorVencerOvencido = false;
        }
      }
    });

    this.dataService.Usuarios$.subscribe({
      next: (data) => {
        if (data) {
          this.usuarios = data;
          this.usuario = this.usuarios.find(user => user.id == this.dataEmpresa.usuarioId && user.administrador);
        }
      }
    });

    this.refresh();
  }

  public async refresh() {
    // this.cacheService.remove('Usuarios');
    await this.dataService.fetchUsuarios('GET');
    this.cacheService.remove('Empresa');
    // await this.dataService.fetchEmpresa('GET');
    await this.authService.refreshEmpresaInfo();
  }

  comprobarVencimiento(fecha: string) {
    const diferenciaDias = this.sharedService.getDiasDeDiferencia(fecha);

    if (diferenciaDias <= 0) {
      this.fechaOk = false;
      this.fechaCercaVencimiento = false;
      this.fechaPorVencerOvencido = true;
    } else if (diferenciaDias <= 5) {
      this.fechaOk = false;
      this.fechaCercaVencimiento = true;
      this.fechaPorVencerOvencido = false;
    } else if (diferenciaDias >= 6) {
      this.fechaOk = true;
      this.fechaCercaVencimiento = false;
      this.fechaPorVencerOvencido = false;
    }
  }

  abrirWhatsApp(periodo: string) {
    const mensaje = `Hola, estoy interesado en extender mi periodo de licencia a ${periodo} más.`;
    const referencia = `(E${this.dataEmpresa.id}${this.usuario && this.usuario.email ? ` - Administrador: ${this.usuario.email})` : ')'}`;
    const wsp = `https://wa.me/${GlobalVariables.wspNumer}?text=${encodeURIComponent(mensaje + ' ' + referencia)}`;
    window.open(wsp, '_blank', 'noopener,noreferrer');
  }
}
