import {Component, OnInit, OnChanges, Input, HostListener} from '@angular/core';


@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnChanges {
  // variables passed into team component
  @Input() pokemon = {};
  @Input() sprites = {};
  @Input() pokemonImage = '';
  @Input() pokemonName = '';
  @Input() pokemonID = '';
  @Input() pokemonHeight = '';
  @Input() pokemonWeight = '';
  @Input() pokemonColor = '';
  @Input() pokemonType = [];
  @Input() pokemonDescriptions: string[] = [];
  @Input() pokemonDescription = '';
  @Input() pokemonLocations: string[] = [];
  @Input() pokemonMoves: string[] = [];
  customOptions = {
    protocol: "https",
    //hostName: "localhost:4200",
    versionPath: "/api/v2/",
    cache: true,
    timeout: 5 * 1000, // 5s
    cacheImages: true
  }
  PokeAPI = require("pokeapi-js-wrapper")
  Pokedex = new this.PokeAPI.Pokedex(customElements);
  descriptionDiv = true;
  locationsDiv = false;
  movesDiv = false;
  normal = 'normal';
  bold = 'bold';
  screenWidth: number = 0;
  screenHeight: number = 0;
  styleFlag: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    // @ts-ignore
    document.getElementById('defaultImgBtn').style.fontWeight = this.bold;
    // @ts-ignore
    document.getElementById('descriptionBtn').style.fontWeight = this.bold;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    //console.log("w: " + this.screenWidth + " h: " + this.screenHeight);
    this.styleFlag = this.screenWidth > 400 && this.screenHeight > 400;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    //console.log("w: " + this.screenWidth + " h: " + this.screenHeight);
    this.styleFlag = this.screenWidth > 400 && this.screenHeight > 400;
  }

  ngOnChanges() {
    this.descriptionDiv = true;
    this.locationsDiv = false;
    this.movesDiv = false;
    document.body.style.backgroundColor = "#ffffff";
    // @ts-ignore
    document.getElementById('defaultImgBtn').style.fontWeight = this.bold;
    // @ts-ignore
    document.getElementById('shinyImgBtn').style.fontWeight = this.normal;
    // @ts-ignore
    document.getElementById('descriptionBtn').style.fontWeight = this.bold;
    // @ts-ignore
    document.getElementById('locationsBtn').style.fontWeight = this.normal;
    // @ts-ignore
    document.getElementById('movesBtn').style.fontWeight = this.normal;
  }

  showImage(option: string): void {
    switch (option) {
      case 'default' : {
        this.pokemonImage = JSON.parse(JSON.stringify(this.sprites)).front_default;
        if (this.pokemonImage === null) {
          this.pokemonImage = "./assets/images/pokeball1.jpg";
        }
        // @ts-ignore
        document.getElementById('defaultImgBtn').style.fontWeight = this.bold;
        // @ts-ignore
        document.getElementById('shinyImgBtn').style.fontWeight = this.normal;
        break;
      }
      case 'shiny' : {
        this.pokemonImage = JSON.parse(JSON.stringify(this.sprites)).front_shiny;
        if (this.pokemonImage === null) {
          this.pokemonImage = "./assets/images/pokeball1.jpg";
        }
        // @ts-ignore
        document.getElementById('defaultImgBtn').style.fontWeight = this.normal;
        // @ts-ignore
        document.getElementById('shinyImgBtn').style.fontWeight = this.bold;
        break;
      }
      default : {
        this.pokemonImage = "./assets/images/pokeball1.jpg";
        break;
      }
    }
  }

  showDescription() {
    this.descriptionDiv = true;
    this.locationsDiv = false;
    this.movesDiv = false;
    // @ts-ignore
    document.getElementById('descriptionBtn').style.fontWeight = this.bold;
    // @ts-ignore
    document.getElementById('locationsBtn').style.fontWeight = this.normal;
    // @ts-ignore
    document.getElementById('movesBtn').style.fontWeight = this.normal;

  }

  showLocations() {
    this.descriptionDiv = false;
    this.locationsDiv = true;
    this.movesDiv = false;
    // @ts-ignore
    document.getElementById('descriptionBtn').style.fontWeight = this.normal;
    // @ts-ignore
    document.getElementById('locationsBtn').style.fontWeight = this.bold;
    // @ts-ignore
    document.getElementById('movesBtn').style.fontWeight = this.normal;
  }

  showMoves() {
    this.descriptionDiv = false;
    this.locationsDiv = false;
    this.movesDiv = true;
    // @ts-ignore
    document.getElementById('descriptionBtn').style.fontWeight = this.normal;
    // @ts-ignore
    document.getElementById('locationsBtn').style.fontWeight = this.normal;
    // @ts-ignore
    document.getElementById('movesBtn').style.fontWeight = this.bold;
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
}
