import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  respuestaBackend: any = null;
  errorMensaje: string = '';
  
  // Usar el Client ID directo sin "api://" para evitar requerir permisos de admin en Azure
  private readonly API_SCOPE = 'c926387b-811c-4ffb-a71a-53ff3beaedac/.default';

  constructor(
    private http: HttpClient,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result) {
          this.msalService.instance.setActiveAccount(result.account);
        }
      }
    });

    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe((result: any) => {
        if (result.payload?.account) {
          this.msalService.instance.setActiveAccount(result.payload.account);
        }
      });

    if (!this.msalService.instance.getActiveAccount() && this.msalService.instance.getAllAccounts().length > 0) {
      this.msalService.instance.setActiveAccount(this.msalService.instance.getAllAccounts()[0]);
    }
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }

  obtenerUsuario(): string {
    const account = this.msalService.instance.getActiveAccount();
    return account ? `${account.name} (${account.username})` : '';
  }

  iniciarSesion(): void {
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile', 'email', this.API_SCOPE]
    });
  }

  cerrarSesion(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200'
    });
  }

  probarConexion(): void {
    this.respuestaBackend = null;
    this.errorMensaje = '';

    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount) {
      this.errorMensaje = 'Debes iniciar sesión con Azure AD primero.';
      return;
    }

    const request = {
      scopes: [this.API_SCOPE],
      account: activeAccount
    };

    this.msalService.acquireTokenSilent(request).subscribe({
      next: (response) => {
        this.ejecutarPeticionBackend(response.accessToken);
      },
      error: () => {
        this.msalService.acquireTokenRedirect(request);
      }
    });
  }

  private ejecutarPeticionBackend(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:8080/api/pedidos', { headers }).subscribe({
      next: (res: any) => {
        this.respuestaBackend = res;
      },
      error: (err) => {
        this.errorMensaje = `Error ${err.status}: ${err.statusText || 'Acceso denegado por el backend'}`;
      }
    });
  }
}