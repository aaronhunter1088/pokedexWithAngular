import { Component, OnChanges, OnInit } from '@angular/core';
import { PokemonService } from "../services/pokemon.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  constructor(private pokemonService: PokemonService, private http: HttpClient) {
  }

  pokemonMap = new Map<number, any>();
  page: number = 1;
  blankPageNumber: string = ''
  itemsPerPage = 10;
  numberOfPokemon: number = 0;
  defaultImagePresent: boolean = false;
  showGifs: boolean = false;
  gifImagePresent: boolean = false;

  ngOnInit(): void {
    this.page = this.pokemonService.getSavedPage();
    this.itemsPerPage = 10;
    this.getThePokemon();
  }

  ngOnReload() {}

  ngOnDestroy() {
    this.pokemonService.saveCurrentPage(this.page);
    //this.pokemonService.savePokemonID(pokemon.value.id);
  }

  getThePokemon() {
    console.log("page number is ", this.page);
    this.itemsPerPage = 10;
    console.log("itemsPerPage: ", this.itemsPerPage);
    // @ts-ignore
    this.pokemonService.getPokemonList(this.itemsPerPage, (this.page - 1) * 10)
      .then((pokemonListResponse: any) => {
        this.pokemonMap = this.newMap();
        //console.log(response);
        this.numberOfPokemon = pokemonListResponse.count;
        console.log("numberOfPokemon: ", this.numberOfPokemon);
        pokemonListResponse.results.forEach((pokemon: any) => {
          this.pokemonService.getPokemonSpecificData(pokemon.name)
            .then((pokemon: any) => {
              //console.log(pokemon);
              let sprites = pokemon['sprites'];
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
              this.pokemonService.getPokemonSpeciesData(pokemon['species'].url)
                .subscribe((speciesData: any) => {
                  pokemon.color = speciesData['color'].name;
                  this.pokemonMap.set(pokemon.id, pokemon);
                });
            });
        });
      });
    this.blankPageNumber = '';
  }

  getPokemonMapValues() {
    return Array.from(this.pokemonMap.values());
  }

  newMap() {
    return new Map<number, any>();
  }

  getPokemonSprites(pokemon: any) {
    //console.log(pokemon);
    let sprites = pokemon['sprites'];
    let otherSprites =  sprites['other'];
    //console.log("getPokemonSprites");
    //console.log(sprites['front_default']);
    let frontImg = sprites['front_default'];
    this.defaultImagePresent = frontImg != null;
    let shinyImg = sprites['front_shiny'];
    let officialImg = otherSprites['official-artwork'].front_default;
    let gifImg = pokemon['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
    this.gifImagePresent = gifImg != null;
    return {'front': frontImg, 'shiny': shinyImg, 'official': officialImg, 'gif': gifImg};
    //return [frontImg, shinyImg, officialArtwork];
  }

  showOfficialArtwork(pokemon: any) {
    //console.log("showOfficialArtwork");
    //console.log(pokemon.name);
    let images = this.getPokemonSprites(pokemon);
    //console.log(this.officialImg);
    this.defaultImagePresent = true;
    return images.official;
  }

  showFrontImage(pokemon: any) {
    //console.log("left, showFrontImage");
    //console.log(pokemon.name);
    let images = this.getPokemonSprites(pokemon);
    //console.log(this.frontImg);
    this.defaultImagePresent = false;
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

  setNewPageNumber(newPage: string) {
    this.page = Number.parseInt(newPage);
    this.getThePokemon();
    this.pokemonService.saveCurrentPage(this.page);
    this.blankPageNumber = '';
  }

  displayGifHelpText() {
    return ;
  }
}
