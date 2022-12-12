import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-evolutions',
  templateUrl: './evolutions.component.html',
  styleUrls: ['./evolutions.component.css']
})
export class EvolutionsComponent implements OnInit {

  pokemonIDToEvolutionChainMap = new Map<number, number[]>();

  constructor(private route: ActivatedRoute) {
    this.generateEvolutionsMap();
  }

  ngOnInit() {
    console.log("Evolutions Page loaded");
    this.route.params
      .subscribe(params => {
        let pokemonID = <number>params['pokemonID'].split("=")[1].trim();
        if(pokemonID != null){
          console.log("chosen pokemon with ID: '" + pokemonID + "'");
          let pokemonChainID = this.getEvolutionChainID(pokemonID);
        }
    });
  }

  generateEvolutionsMap() {
    this.pokemonIDToEvolutionChainMap = new Map<number, number[]>(
      [
        [1, [1, 2, 3]], [2, [4, 5, 6]],
        [3, [7, 8, 9]], [4, [10, 11, 12]]
      ]);
    // this.pokemonIDToEvolutionChainMap.set(
    //   1, [1, 2, 3]
    // ).set(
    //   2, [4, 5, 6]
    // ).set(
    //   3, [7, 8, 9]
    // );
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
