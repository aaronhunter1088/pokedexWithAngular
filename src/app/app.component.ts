import { Component, OnChanges, OnInit } from '@angular/core';
import { PokemonService } from "./services/pokemon.service";
import { HttpClient } from "@angular/common/http";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {

  currentRoute: string;

  constructor(private router: Router, private pokemonService: PokemonService, private http: HttpClient) {
    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.currentRoute = event.url;
        this.keepWhiteBackground();
        console.log(event);
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });

  }

  title = 'PokedexHome'

  ngOnInit(): void {
    document.body.style.backgroundColor = "#ffffff";
  }

  ngOnChanges() {
    document.body.style.backgroundColor = "#ffffff";
  }

  keepWhiteBackground() {
    document.body.style.backgroundColor = "#ffffff";
  }

}

