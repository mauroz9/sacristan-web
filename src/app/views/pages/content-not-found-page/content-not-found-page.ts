import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-not-found-page',
  imports: [],
  templateUrl: './content-not-found-page.html',
  styleUrl: './content-not-found-page.css',
})
export class ContentNotFoundPage {  

  constructor (private router: Router) {}

  goBack() {
    window.history.back();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
