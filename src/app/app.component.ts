import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>Sistema Pedidos360 - Prueba de Conexión</h2>

      <!-- Estado: NO AUTENTICADO -->
      <div *ngIf="!usuario" style="margin-top: 15px;">
        <p style="color: #d13438; font-weight: bold;">⚠ Debes iniciar sesión antes de probar la conexión con el backend.</p>
        <button (click)="login()" style="padding: 10px 18px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
          Iniciar Sesión con Azure AD
        </button>
      </div>

      <!-- Estado: AUTENTICADO -->
      <div *ngIf="usuario" style="margin-top: 15px;">
        <p style="color: #107c41; font-weight: bold;">✔ Usuario activo: {{ usuario.name }} ({{ usuario.username }})</p>

        <div style="margin-top: 15px; display: flex; gap: 10px;">
          <button (click)="consultarBackend()" style="padding: 10px 18px; background: #107c41; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Probar conexión con Backend Spring Boot
          </button>

          <button (click)="logout()" style="padding: 10px 18px; background: #a80000; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Cerrar Sesión
          </button>
        </div>

        <div *ngIf="respuestaBackend" style="margin-top: 20px; background: #eef9ff; border: 1px solid #0078d4; padding: 15px; border-radius: 6px;">
          <h4 style="margin-top: 0; color: #0078d4;">Respuesta de Spring Boot (200 OK):</h4>
          <pre style="background: white; padding: 10px; border-radius: 4px;">{{ respuestaBackend | json }}</pre>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  usuario: any = null;
  respuestaBackend: any = null;

  constructor(private http: HttpClient, private msalService: MsalService) {}

  ngOnInit() {
    this.msalService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result) {
          this.msalService.instance.setActiveAccount(result.account);
          this.usuario = result.account;
        } else {
          const accounts = this.msalService.instance.getAllAccounts();
          if (accounts.length > 0) {
            this.msalService.instance.setActiveAccount(accounts[0]);
            this.usuario = accounts[0];
          }
        }
      },
      error: (err) => console.error('Error al procesar redirección:', err)
    });
  }

  login() {
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile', 'email']
    });
  }

  logout() {
    this.msalService.logoutRedirect();
  }

  consultarBackend() {
    const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
    if (!account) return;

    this.msalService.acquireTokenSilent({
      scopes: ['openid', 'profile'],
      account: account
    }).subscribe({
      next: (result) => this.ejecutarPeticion(result.idToken),
      error: () => {
        this.msalService.acquireTokenRedirect({
          scopes: ['openid', 'profile'],
          account: account
        });
      }
    });
  }

  private ejecutarPeticion(token: string) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get('http://localhost:8080/api/pedidos', { headers }).subscribe({
      next: (data) => this.respuestaBackend = data,
      error: (err) => console.error('Error al conectar con backend:', err)
    });
  }
}