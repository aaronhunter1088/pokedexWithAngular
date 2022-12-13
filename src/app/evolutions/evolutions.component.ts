import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-evolutions',
  templateUrl: './evolutions.component.html',
  styleUrls: ['./evolutions.component.css']
})
export class EvolutionsComponent implements OnInit {

  pokemonIDToEvolutionChainMap = new Map<number, number[]>();
  pokemonChainID: number;
  pokemonFamilySize: number;

  constructor(private route: ActivatedRoute) {
    this.generateEvolutionsMap();
    this.pokemonChainID = 0;
    this.pokemonFamilySize = 0;
  }

  ngOnInit() {
    console.log("Evolutions Page loaded");
    this.route.params
      .subscribe(params => {
        let pokemonID = <number>params['pokemonID'].split("=")[1].trim();
        if(pokemonID != null){
          console.log("chosen pokemon with ID: '" + pokemonID + "'");
          this.pokemonChainID = this.getEvolutionChainID(pokemonID);
          Array.of(this.pokemonIDToEvolutionChainMap.get(this.pokemonChainID)).forEach(x => {
            // @ts-ignore
            this.pokemonFamilySize = x.length;
          })
          console.log("chainID: ", this.pokemonChainID, " and number of pokemon in family: ", this.pokemonFamilySize);
        }
    });
  }

  generateEvolutionsMap() {
    this.pokemonIDToEvolutionChainMap = new Map<number, number[]>(
      [
        [1, [1, 2, 3, 10195]], [2, [4, 5, 6, 10196]],
        [3, [7, 8, 9, 10197]], [4, [10, 11, 12]],
        [5, [13, 14, 15]], [6, [16, 17, 18]],
        [7, [19, 20]], [8, [21, 22]],
        [9, [23, 24]], [10, [172, 25, 26]]
      ]);
  }

  getEvolutionChainID(pokemonID: number): number {
    let keys = Array.from(this.pokemonIDToEvolutionChainMap.keys());
    //console.log("map keys", keys);
    let keyToReturn = 0;
    keys.forEach(key => {
      if (keyToReturn == 0) { // stop looping after chainID is found
        let chainIDs = this.pokemonIDToEvolutionChainMap.get(key);
        console.log("key: ", key, " chainIDs", chainIDs);
        // @ts-ignore
        chainIDs.forEach(chainID => {
          if (pokemonID == chainID) {
            console.log(pokemonID + " found with key", key, ", chainIDS: ", chainIDs);
            console.log("pokemonChainID: ", key);
            keyToReturn = key;
            return;
          }
        });
      }
    });
    return keyToReturn;
  }
}
