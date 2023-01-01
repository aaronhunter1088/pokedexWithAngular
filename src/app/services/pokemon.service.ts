import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) {}

  PokeAPI = require("pokeapi-js-wrapper")
  Pokedex = new this.PokeAPI.Pokedex();
  savedPageNumber: number = 1;
  pokemonID: number = 0;

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

  getPokemonSpeciesData(speciesURL: string) { // speciesURL: string
    //console.log("service: ", this.Pokedex.getPokemonSpecies(pokemonIDName).then((res: any) => res.body))
    //return this.Pokedex.getPokemonSpecies(pokemonIDName);
    return this.callURL(speciesURL);
  }

  getPokemonLocationEncounters(pokemonID: string) {
    //console.log("inside pokemonLocationEncounters pokemonID: ", pokemonID);
    return this.Pokedex.getPokemonEncounterAreas(pokemonID);
  }

  async getPokemonChainData(pokemonChainID: string): Promise<object> {
    let response = await this.Pokedex.getEvolutionChain(pokemonChainID)
    return response
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

  savePokemonID(pokemonID: number) {
    console.log("saving pokemonID: ", pokemonID);
    this.pokemonID = pokemonID;
  }

}
