import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {async} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) {}

  PokeAPI = require("pokeapi-js-wrapper")
  Pokedex = new this.PokeAPI.Pokedex();
  savedPageNumber: number = 1;

  getPokemonList(_limit: number, _offset: number) {
    const interval = {
      limit: _limit,
      offset: _offset
    }
    return this.Pokedex.getPokemonsList(interval);
  }

  getPokemonByName(pokemonIDName: string | number) {
    return this.Pokedex.getPokemonByName(pokemonIDName);
  }

  getPokemonSpecificData(pokemonName: string) {
    return this.Pokedex.getPokemonByName(pokemonName);
  }

  getPokemonSpeciesData(speciesURL: string) {
    //return this.Pokedex.getPokemonSpeciesByName(pokemonName);
    return this.callURL(speciesURL);
  }

  getPokemonLocationEncounters(pokemonID: string) {
    console.log("inside pokemonLocationEncounters pokemonID: ", pokemonID);
    return this.Pokedex.getPokemonEncounterAreas(pokemonID);
  }

  callURL(url: any) {
    return this.http.get(url);
  }

  saveCurrentPage(page: number) {
    console.log("saving page: ", page);
    this.savedPageNumber = page;
  }

  getSavedPage(): number {
    return this.savedPageNumber;
  }

  /*
        this.pokemonService.Pokedex.resource([
          "/api/v2/pokemon/"+this.pokemonID+"/encounters",
        ]).then( (locations: any) =>
        {
          //console.log("locations: ");
          console.log("locations: ", locations);
          if (locations[0].length == 0) {
            this.pokemonLocations.push("No known locations!");
          } else {
            for(let i=0; i<locations[0].length; i++) {
              let location = JSON.parse(JSON.stringify(locations[0][i]));
              //console.log("location: ");
              let locationArea = JSON.parse(JSON.stringify(location))['location_area'];
              //console.log(locationArea.name);
              let names = locationArea.name.split("-")
              let newName = '';
              names.forEach((name: string) => {
                name = name[0].toUpperCase() + name.substring(1);
                newName += name + " ";
                //console.log(newName);
              });
              this.pokemonLocations.push(newName);
              //this.pokemonLocations.push(locationArea.name);
            }
            this.pokemonLocations.sort();
          }
        })
         */
}
