import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-evolutions',
  templateUrl: './evolutions.component.html',
  styleUrls: ['./evolutions.component.css']
})
export class EvolutionsComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("Evolutions Page loaded");
    this.route.params
      .subscribe(params => {
        let pokemonName = <string>params['pokemonName'].split("=")[1].trim();
        if(pokemonName != null){
          console.log("chosen pokemon: '" + pokemonName + "'");
        }
    });
  }
}
