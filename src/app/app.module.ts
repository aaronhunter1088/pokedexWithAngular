import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppRoutingModule, routingComponents} from './app-routing.module';
import { AppComponent } from './app.component';
import { PokedexComponent } from './pokedex/pokedex.component';
import { NgxPaginationModule} from  'ngx-pagination';
import { HttpClientModule } from "@angular/common/http";
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {OrderModule} from "ngx-order-pipe";
import { ArraySortPipe } from './array-sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PokedexComponent,
    PokemonListComponent,
    routingComponents,
    ArraySortPipe,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgxPaginationModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
        OrderModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
