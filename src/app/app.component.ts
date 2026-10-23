import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PedidoService } from './services/pedido.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  respuestaBackend: any = null;
  errorMensaje = '';

  constructor(
    private msalService: MsalService,
    private pedidoService: PedidoService
  ) {}

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }

  obtenerUsuario(): string {
    const account = this.msalService.instance.getActiveAccount();
    return account ? `${account.name} (${account.username})` : '';
  }

  iniciarSesion(): void {
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile', 'email', environment.api.scope]
    });
  }

  cerrarSesion(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.azure.redirectUri
    });
  }

  // Llama al backend a través del API Gateway; el interceptor envía el JWT
  probarConexion(): void {
    this.respuestaBackend = null;
    this.errorMensaje = '';
    this.pedidoService.obtenerPedidos().subscribe({
      next: (res) => (this.respuestaBackend = res),
      error: (err) =>
        (this.errorMensaje = `Error ${err.status}: ${err.statusText || 'Acceso denegado por el backend'}`)
    });
  }
}
