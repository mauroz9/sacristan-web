import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../logic/services/auth-service';
import { Subscription } from 'rxjs';
import { TypeofExpression } from '@angular/compiler';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit {

  loggedIn = false;
  loading = false;
  private authSub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.loggedIn = status;
    });

    if (localStorage.getItem('auth_token')) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  async logout() {
    this.loading = true;
    await this.authService.logout();
    this.loading = false;
  }

}
