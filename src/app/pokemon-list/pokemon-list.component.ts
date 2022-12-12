import { Component, OnChanges, OnInit } from '@angular/core';
import { PokemonService } from "../services/pokemon.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnChanges {

  constructor(private pokemonService: PokemonService, private http: HttpClient) {
  }

  pokemonMap = new Map<number, any>();
  page: number = 1;
  numberOfPokemon: number | undefined;
  showDefaultImage: boolean = false;

  ngOnInit(): void {
    this.page = this.pokemonService.getSavedPage();
    this.getThePokemon();
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    this.pokemonService.saveCurrentPage(this.page);
  }

  getThePokemon() {
    console.log("page number is ", this.page);
    // @ts-ignore
    this.pokemonService.getPokemon(10, (this.page - 1) * 10)
      .then((pokemonListResponse: any) => {
        //console.log(response);
        this.numberOfPokemon = pokemonListResponse.count;
        pokemonListResponse.results.forEach((pokemonResult: any) => {
          this.pokemonService.getPokemonSpecificData(pokemonResult.name)
            .then((pokemon: any) => {
              //console.log(pokemon);
              let sprites = JSON.parse(JSON.stringify(pokemon['sprites']));
              let types = pokemon.types;
              let pokemonType = '';
              //console.log(types);
              if (types.length > 1) {
                //console.log("more than 1 type");
                pokemonType = types[0].type.name[0].toUpperCase()+types[0].type.name.substring(1) + " & " + types[1].type.name[0].toUpperCase()+types[1].type.name.substring(1);
              } else {
                //console.log("only 1 type");
                pokemonType = types[0].type.name[0].toUpperCase()+types[0].type.name.substring(1);
              }
              pokemon.type = pokemonType;
              let frontImg = sprites['front_default'];
              pokemon.showDefaultImage = frontImg != null;
              this.pokemonService.getPokemonSpeciesData(pokemonResult.name)
                .then((speciesData: any) => {
                  let color = JSON.parse(JSON.stringify(speciesData['color'])).name;
                  //console.log(color);
                  pokemon.color = color;
                  this.pokemonMap.set(pokemon.id, JSON.parse(JSON.stringify(pokemon)));
                  this.updatePage(<number>this.page);
                })
                .catch((error: any) => {
                  //console.log("getPokemonSpeciesData failed for ", pokemonResult.name);
                  let species = JSON.parse(JSON.stringify(pokemon['species']));
                  this.pokemonService.callURL(species.url)
                    .subscribe((response: any) =>{
                      let color = JSON.parse(JSON.stringify(response['color'])).name;
                      //console.log(color);
                      pokemon.color = color;
                      this.pokemonMap.set(pokemon.id, JSON.parse(JSON.stringify(pokemon)));
                    });
                });
            });
        });
      });
  }

  getPokemonMapValues() {
    return Array.from(this.pokemonMap.values());
  }

  openEvolutions(pokemon: any) {
    console.log("clicked me: ")
  }

  getPokemonSprites(pokemon: any) {
    //console.log(pokemon);
    let sprites = JSON.parse(JSON.stringify(pokemon['sprites']));
    let otherSprites =  JSON.parse(JSON.stringify(sprites['other']));
    //console.log("getPokemonSprites");
    //console.log(sprites['front_default']);
    let frontImg = sprites['front_default'];
    this.showDefaultImage = frontImg != '';
    let shinyImg = sprites['front_shiny'];
    let officialImg = JSON.parse(JSON.stringify(otherSprites['official-artwork'])).front_default;
    //console.log(officialArtwork);
    return {'front': frontImg, 'shiny': shinyImg, 'official': officialImg};
    //return [frontImg, shinyImg, officialArtwork];
  }

  newMap() {
    return new Map<number, any>();
  }

  //KeyValue<"official" | "shiny" | "front", { official: any; shiny: any; front: any }[P]>
  showOfficialArtwork(pokemon: any) {
    //console.log("showOfficialArtwork");
    //console.log(pokemon.name);
    let images = this.getPokemonSprites(pokemon);
    //console.log(this.officialImg);
    this.showDefaultImage = true;
    return images.official;
  }

  showFrontImage(pokemon: any) {
    //console.log("left, showFrontImage");
    //console.log(pokemon.name);
    let images = this.getPokemonSprites(pokemon);
    //console.log(this.frontImg);
    this.showDefaultImage = false;
    return images.front;
  }

  changeColor(pokemonColor: string): string {
    if (pokemonColor === "red") { return "#FA8072"; }
    else if (pokemonColor === "yellow") { return "#ffeb18"; }
    else if (pokemonColor === "green") { return "#AFE1AF"; }
    else if (pokemonColor === "blue") { return "#ADD8E6"; }
    else if (pokemonColor === "purple") { return "#CBC3E3"; }
    else if (pokemonColor === "brown") { return "#D27D2D"; }
    else if (pokemonColor === "white") { return "#d2cbd3"; }
    else if (pokemonColor === "pink") { return "#ef6bb6ff"; }
    else if (pokemonColor === "black") { return "#8f8b8b"}
    else if (pokemonColor === "gray" || pokemonColor === "grey") { return "#8f8b8b"}
    else return "#ffffff";
  }

  updatePage(newPage: number) {
    this.page = newPage;
  }
}
