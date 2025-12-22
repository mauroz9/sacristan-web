import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../logic/services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit {

  loggedIn = false;
  private authSub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      console.log(status);
      this.loggedIn = status;
    });
  }

  logout() {
    this.authService.logout();
  }

}
