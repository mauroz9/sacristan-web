import { Component } from '@angular/core';

@Component({
  selector: 'app-content-not-found-page',
  imports: [],
  templateUrl: './content-not-found-page.html',
  styleUrl: './content-not-found-page.css',
})
export class ContentNotFoundPage {  
  goBack() {
    window.history.back();
  }

  goHome() {
    window.location.href = '/dashboard'; 
  }
}
