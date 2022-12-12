import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) {}

  PokeAPI = require("pokeapi-js-wrapper")
  Pokedex = new this.PokeAPI.Pokedex();

  getPokemon(_limit: number, _offset: number) {
    const interval = {
      limit: _limit,
      offset: _offset
    }
    return this.Pokedex.getPokemonsList(interval);
  }

  getPokemonSpecificData(pokemonName: string) {
    return this.Pokedex.getPokemonByName(pokemonName);
  }

  getPokemonSpeciesData(pokemonName: string) {
    return this.Pokedex.getPokemonSpeciesByName(pokemonName);

  }

  callURL(url: any) {
    return this.http.get(url);

  }
}
