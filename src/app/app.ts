import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./views/components/shared/header-component/header-component";
import { MenuComponent } from "./views/components/shared/menu-component/menu-component";
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto-instituto-sacristan-pictogramas');

  menuVisible: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.activatedRoute),
    map(route => {
      while (route.firstChild) route = route.firstChild;
      return route;
    }),
    mergeMap(route => route.data)
  ).subscribe(data => {
    this.menuVisible = data['showMenu'] !== false;
  });
}


}
