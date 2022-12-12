import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";
import { EvolutionsComponent } from "./evolutions/evolutions.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  {path: '', component: PokemonListComponent},
  {path: 'search', component: SearchComponent},
  {path: 'evolutions/:pokemonID', component: EvolutionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [SearchComponent, PokemonListComponent, EvolutionsComponent]
