import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./views/components/shared/header-component/header-component";
import { MenuComponent } from "./views/components/shared/menu-component/menu-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-instituto-sacristan-pictogramas');
}
