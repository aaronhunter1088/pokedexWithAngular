import {Component, OnInit, OnChanges, Input, HostListener} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // variables passed into team component
  pokemonIDName = '';
  pokemon = ''; // pokemon = '';
  pokemonName = '';
  sprites = ''; // sprites: object = {};
  pokemonImage = '';
  pokemonID = '';
  pokemonHeight = '';
  pokemonWeight = '';
  pokemonColor = '';
  pokemonType = [];
  pokemonDescriptions: any[] = [];
  pokemonDescription = '';
  pokemonLocations: any[] = [];
  pokemonMoves: any[] = [];
  statusCode: number = 0;
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
    document.body.style.backgroundColor = "#ffffff";
  }

  onInput(pokemonIDName: string) {
    this.pokemonIDName = pokemonIDName;
  }

  isValidName(nameOrId: string) {
    let code = 0;
    fetch("https://pokeapi.co/api/v2/pokemon/"+nameOrId)
      .then((response) => {
        if (response.ok && nameOrId.length > 0) {
          code = 200;
          this.statusCode = code;
          console.log("Response.ok and code ", code, " and name/ID is '", nameOrId, "'");
        }
        else if (!nameOrId) {
          code = 400;
          this.statusCode = code;
          alert("Not a valid name or ID: '" + this.pokemonIDName + "' and statusCode: " + this.statusCode);
          console.log("code", code);
          //return;
        }
        else { throw new Error('Something went wrong'); }
      })
      .catch((error) => {
        code = 404;
        console.log("code", code);
        this.statusCode = code;
        this.pokemonIDName = nameOrId;
        console.log('There was an ERROR: ', error);
        alert("Not a valid name or ID: '" + this.pokemonIDName + "' and statusCode: " + this.statusCode);
      });
  }

  getPokemonInfo() {
    this.isValidName(this.pokemonIDName);
    const PokeAPI = require("pokeapi-js-wrapper")
    const customOptions = {
      protocol: "https",
      hostName: "pokeapi.co",
      versionPath: "/api/v2/",
      cache: true,
      timeout: 5 * 1000, // 5s
      cacheImages: true
    }
    const Pokedex = new PokeAPI.Pokedex(customOptions);
    this.pokemon = '';
    this.pokemonDescription = '';
    this.pokemonLocations = [];
    this.pokemonMoves = [];
    Pokedex.getPokemonByName(this.pokemonIDName)
      .then((response: any) => {
        this.pokemon = JSON.parse(JSON.stringify(response));
        //console.log("pokemon: ");
        //console.log(this.pokemon);
        //console.log("name: " + JSON.parse(JSON.stringify(response)).name);
        this.pokemonName = JSON.parse(JSON.stringify(response)).name;
        this.sprites = JSON.parse(JSON.stringify(response))['sprites'];
        //console.log("sprites");
        //console.log(this.sprites);
        this.pokemonImage = JSON.parse(JSON.stringify(this.sprites)).front_default;
        this.pokemonName = JSON.parse(JSON.stringify(this.pokemon)).name;
        this.pokemonID = JSON.parse(JSON.stringify(this.pokemon)).id;
        this.pokemonHeight = JSON.parse(JSON.stringify(this.pokemon)).height;
        this.pokemonWeight = JSON.parse(JSON.stringify(this.pokemon)).weight;
        // get and set color, and pokemon description
        Pokedex.getPokemonSpeciesByName(this.pokemonName)
          .then((response: any) => {
            //console.log("pokemon species: ");
            //console.log(response);
            this.pokemonColor = JSON.parse(JSON.stringify(response.color)).name;
            this.setBackgroundColor();
            //console.log("pokemon descriptions: ");
            //console.log(JSON.parse(JSON.stringify(response.flavor_text_entries)));
            this.pokemonDescriptions = JSON.parse(JSON.stringify(response.flavor_text_entries));
            //let randomIndex = Math.floor(Math.random() * this.pokemonDescriptions.length);
            this.pokemonDescription = this.getEnglishDescriptions();
          });
        // parse over the types
        this.pokemonType = JSON.parse(JSON.stringify(this.pokemon)).types;
        //console.log("pokemonType");
        //console.log(this.pokemonType);
        if (this.pokemonType.length > 1) {
          //console.log("more than 1 type");
          // @ts-ignore
          this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase()+this.pokemonType[0].type.name.substring(1) + " and " + this.pokemonType[1].type.name[0].toUpperCase()+this.pokemonType[1].type.name.substring(1);
        } else {
          //console.log("only 1 type");
          // @ts-ignore
          this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase()+this.pokemonType[0].type.name.substring(1);
        }
        // locations
        Pokedex.resource([
          "/api/v2/pokemon/"+this.pokemonID+"/encounters",
        ]).then( (locations: any) => {
          //console.log("locations: ");
          //console.log(locations[0]);
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
        // moves
        let allMoves = JSON.parse(JSON.stringify(this.pokemon))['moves'];
        //console.log("all moves: ");
        //console.log(allMoves);
        for(let i=0; i<allMoves.length; i++) {
          //console.log("move: ");
          //console.log(JSON.parse(JSON.stringify(allMoves[i]))['move'].name);
          let move = JSON.parse(JSON.stringify(allMoves[i]))['move'].name;
          move = move[0].toUpperCase() + move.substring(1);
          this.pokemonMoves.push(move);
        }
        this.pokemonMoves.sort();
      })
      .catch((error: any) => {
        console.log("Couldn't get Pokemon info with: '" + this.pokemonIDName + "'");
        console.log(error);
      });
    this.pokemonIDName = '';
  }

  setBackgroundColor() {
    if (this.pokemonColor === "red") { document.body.style.backgroundColor = "#FA8072"; }
    else if (this.pokemonColor === "yellow") { document.body.style.backgroundColor  = "#FFC300"; }
    else if (this.pokemonColor === "green") { document.body.style.backgroundColor  = "#AFE1AF"; }
    else if (this.pokemonColor === "blue") { document.body.style.backgroundColor  = "#ADD8E6"; }
    else if (this.pokemonColor === "purple") { document.body.style.backgroundColor  = "#CBC3E3"; }
    else if (this.pokemonColor === "brown") { document.body.style.backgroundColor  = "#D27D2D"; }
    else if (this.pokemonColor === "white") { document.body.style.backgroundColor  = "#d3cbcb"; }
    else if (this.pokemonColor === "pink") { document.body.style.backgroundColor = this.pokemonColor; }
    else if (this.pokemonColor === "black") { document.body.style.backgroundColor = "#8f8b8b"}
    else if (this.pokemonColor === "gray" || this.pokemonColor === "grey") { document.body.style.backgroundColor = "#8f8b8b"}
  }

  getEnglishDescriptions() {
    let englishDescriptions: any = [];
    for(let i=0; i<this.pokemonDescriptions.length; i++) {
      // @ts-ignore
      if (JSON.parse(JSON.stringify(this.pokemonDescriptions[i])).language.name === "en") {
        englishDescriptions.push(this.pokemonDescriptions[i]);
      }
    }
    // @ts-ignore
    let randomIndex = Math.floor(Math.random() * englishDescriptions.length-1);
    if (randomIndex < 0) randomIndex = 0;
    this.pokemonDescription = JSON.parse(JSON.stringify(englishDescriptions[randomIndex])).flavor_text;
    //console.log(this.pokemonDescription);
    return this.pokemonDescription;
  }
}
