import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";
import { EvolutionsComponent } from "./evolutions/evolutions.component";
import { SearchComponent } from "./search/search.component";
import { PokedexComponent } from "./pokedex/pokedex.component";

const routes: Routes = [
  {path: '', component: PokemonListComponent},
  {path: 'search', component: SearchComponent},
  {path: 'pokedex/:pokemonID', component: PokedexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [SearchComponent, PokemonListComponent, EvolutionsComponent]
