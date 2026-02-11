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
  loading = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLoggedInStatus().subscribe((status) => {
      this.loggedIn = status; 
  });
  }

  async logout() {
    this.loading = true;
    await this.authService.logout();
    this.loading = false;
  }

}
