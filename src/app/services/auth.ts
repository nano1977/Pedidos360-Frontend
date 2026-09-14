import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private msalService: MsalService) {
    this.checkStatus();
  }

  private checkStatus() {
    const activeAccount = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
    if (activeAccount) {
      this.msalService.instance.setActiveAccount(activeAccount);
      this.loggedInSubject.next(true);
    }
  }

  login() {
    this.msalService.loginRedirect();
  }

  logout() {
    this.msalService.logoutRedirect();
  }

  getUserName(): string {
    const account = this.msalService.instance.getActiveAccount();
    return account ? account.name || account.username : '';
  }
}