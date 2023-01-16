import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { PokemonService } from "../services/pokemon.service";

@Component({
  selector: 'app-evolutions',
  templateUrl: './evolutions.component.html',
  styleUrls: ['./evolutions.component.css']
})
export class EvolutionsComponent implements OnInit, OnChanges {

  @Input() pokemonID: string | number  = ''
  pokemonIDToEvolutionChainMap = new Map<number, number[][]>()
  pokemonChainID: number
  pokemonFamilyIDs: number[][] = []
  allIDs: number[] = []
  pokemonFamily: any[][] = []
  pokemonFamilyAltLevels: any[] = []
  pokemonIdAndAttributesMap = new Map<number, Map<string, any>>()
  specificAttributesMap = new Map<string, any>()
  pokemonMap = new Map
  pokemonFamilySize: number
  defaultImagePresent: boolean = false
  gifImagePresent: boolean = false
  sprites: any = {}
  stages: number[] = []
  stage: number = 0
  doesPokemonEvolve: boolean = false;
  isBabyPokemon: boolean = false;
  counter: number = 0;
  itemCounter: number = 0;
  attrCounter: number = 0;
  babyCounter: number = 0;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {
    this.generateEvolutionsMap()
    this.specificAttributesMap = this.generateDefaultAttributesMap()
    this.pokemonChainID = 0
    this.pokemonFamilySize = 0
  }

  ngOnInit() {
    //console.log("Evolutions Page loaded");
    this.route.params
      .subscribe(params => {
        //console.log("params", params)
        if (Object.keys(params).length !== 0) {
          //console.log("params keys.length: ", Object.keys(params).length)
          this.pokemonID = <number>params['pokemonID'].split("=")[1].trim();
        }
        if(this.pokemonID != null) {
          //console.log("chosen pokemon with ID: '" + this.pokemonID + "'")
          this.resetEvolutionParameters()
          this.pokemonChainID = this.getEvolutionChainID(Number.parseInt(this.pokemonID.toString()))
          Array.of(this.pokemonIDToEvolutionChainMap.get(this.pokemonChainID)).forEach(family => {
            // @ts-ignore
            this.pokemonFamilyIDs = family; // a list of list of IDs [ [1], [2], [3,10033,10195] ]
            this.setFamilySize();
            this.setStages();
            this.setAllIDs();
            // let chainRes = this.pokemonService.getPokemonChainData(this.pokemonChainID.toString());
            // chainRes.then((chain:any) => {
            //   this.getEvolutionDetails(chain['chain']) //, this.specificAttributesMap, this.pokemonIdAndAttributesMap)
            // }).then(() => {
            //   this.allIDs.forEach(id => {
            //     if (!this.pokemonIdAndAttributesMap.has(id)) {
            //       console.log(id, " not found in attrMapNew. populating with default attrMapNew")
            //       this.pokemonIdAndAttributesMap.set(id, this.generateDefaultAttributesMap())
            //     }
            //   })
            // }).then(() => {
            //   this.cleanupAttributesMap()
            // })
          })
          this.pokemonFamilyIDs.forEach(idList => {
            this.createListOfPokemonForIDList(idList)
          });

        }
    })
  }

  ngOnChanges() {
    //console.log("changes in evolutions")
  }

  generateEvolutionsMap() {
    this.pokemonIDToEvolutionChainMap = new Map<number, number[][]>([
      [1, [[1], [2], [3,10033,10195] ]], // bulbasaur, ivysaur, venusaur, venusaur-mega, venusaur-gmax
      [2, [[4], [5], [6,10034,10035,10196] ]], // squirtle, wartortle, blastoise, blastoise-mega, blastoise-gmax
      [3, [[7], [8], [9,10036,10197] ]], // charmander, charmeleon, charizard, charizard-mega-x, charizard-mega-y charizard-gmax
      [4, [[10], [11], [12,10198] ]], // caterpie, metapod, butterfree, butterfree-gmax
      [5, [[13], [14], [15,10090] ]], // weedle, kakuna, beedrill, beedrill-mega
      [6, [[16], [17], [18,10073] ]], // pidgey, pideotto, pideot, pideot-mega
      [7, [[19,10091], [20,10092,10093] ]], // rattata, rattata-alola, raticate, raticate-alola, raticate-totem-alola
      [8, [[21], [22] ]], // spearow, fearow
      [9, [[23], [24] ]], // ekans, arbok
      [10, [[172], [25,10199], [26,10100] ]], // pichu, pikachu, pikachu-gmax, raichu, raichu-alola
      // pikachu also has ID: 10080-10085,10094-10099,10148,10158,10160
      [11, [[27,10101], [28,10102] ]], //sandrew, sandrew-alola, sandslash, sandslash-alola
      [12, [[29], [30], [31] ]], // nidoran-f, nidorina, nidoqueen
      [13, [[32], [33], [34] ]], // nidoran-m, nidorino, nidoking
      [14, [[173], [35], [36] ]], // cleffa, clefairy, clefable
      [15, [[37,10103], [38,10104] ]], // vulpix, vulpix-alola, ninetales, ninetales-alola
      [16, [[174], [39], [40] ]], // igglybuff, jigglypuff, wigglytuff
      [17, [[41], [42], [169] ]], // zubat, golbat, crobat
      [18, [[43], [44], [45,182] ]], // oddish, gloom, vileplume, bellossom
      [19, [[46], [47] ]], // paras, parasect
      [20, [[48], [49] ]], // venonat, venomoth
      [21, [[50,10105], [51,10106] ]], // diglett, diglett-alola, dugtrio, dugtrio-alola
      [22, [[52,10107,10200,10161], [863,53,10108] ]], // meowth, meowth-gmax, perrserker, meowth-galar, persian, persian-alola
      [23, [[54], [55] ]], // psyduck, golduck
      [24, [[56], [57] ]], // mankey, primeape
      [25, [[58,10229], [59,10230] ]], // growlithe, growlithe-hisui, arcanine, arcanine-hisui
      [26, [[60], [61], [62,186] ]], // poliwag, poliwhirl, poliwrath, politoed
      [27, [[63], [64], [65,10037] ]], // abra, kadabra, alakazam, alakazam-mega
      [28, [[66], [67], [68,10201] ]], // machop, machoke, machamp, machamp-gmax
      [29, [[69], [70], [71] ]], // bellsprout, weepinbell, victreebel
      [30, [[72], [73] ]], // tentacool, tentacruel
      [31, [[74,10109], [75,10110], [76,10111] ]], // geodude, geodude-alola, graveler, graveler-alola, golem, golem-alola
      [32, [[77,10162], [78,10163] ]], // ponyta, ponyta-galar, rapidash, rapidash-galar
      [33, [[79, 10164], [80,10165,10071],  [199,10172] ]], // slowpoke, slowpoke-galar, slowbro, slowbro-galar, slowbro-mega, slowking, slowking-galar
      [34, [[81], [82], [462] ]], // magnemite, magneton, magnezone
      [35, [[83,10166], [865] ]], // farfetchd, farfetchd-galar, Sirfetchd
      [36, [[84], [85] ]], // doduo, dodrio
      [37, [[86], [87] ]], // seel, dewgong
      [38, [[88,10112], [89,10113] ]], // grimer, grimer-alola, muk, muk-alola
      [39, [[90], [91] ]], // shellder, cloyster
      [40, [[92], [93], [94,10038,10202] ]], // gastly, haunter, gengar, gengar-mega, gengar-gmax
      [41, [[95], [208,10072] ]], // onix, steelix, steelix-mega
      [42, [[96], [97] ]], // drowzee, hypno
      [43, [[98], [99,10203] ]], // krabby, kingler, kingler-gmax
      [44, [[100,10231], [101,10232] ]], // voltorb, voltorb-hisui, electrode, electrode-hisui
      [45, [[102], [103,10114] ]], // exeggcute, exeggutor,exeggutor-alola
      [46, [[104], [105,10115,10149] ]], // cubone, marowak, marowak-alola, marowak-totem
      [47, [[236], [106,107,237] ]], // tyroge, hitmonlee, hitmonchan, hitmontop
      [48, [[108], [463] ]], // lickitung, lickilicky
      [49, [[109], [110,10167] ]], // koffing, weezing, weezing-galar
      [50, [[111], [112], [464] ]], // rhyhorn, rhydon, rhyperior
      [51, [[440], [113], [242] ]], // happiny, chansey, blissey
      [52, [[114], [465] ]], // tangela, tangrowth
      [53, [[115,10039] ]], // kangaskhan, kangaskhan-mega
      [54, [[116], [117], [230] ]], // horsea, seadra, kingdra
      [55, [[118], [119] ]], // goldeen, seaking
      [56, [[120], [121] ]], // staryu, starmie
      [57, [[439], [122,10168], [866] ]], // mime-jr, mr-mime, mr-mime-galar, mr-rime
      [58, [[123], [212,10046,900] ]], // scyther, scizor(trade with metal coat), scizor-mega, kleavor(use black augurite)
      [59, [[238], [124] ]], // smoochum, jynx
      [60, [[239], [125], [466] ]], // elekid, electabuzz, electivire
      [61, [[240], [126], [467] ]], // magby, magmar, magmortar
      [62, [[127,10040] ]], // pinsir, pinsir-mega
      [63, [[128] ]], // tauros
      [64, [[129], [130,10041] ]], // magikarp, gyarados, gyarados-mega
      [65, [[131,10204] ]], // lapras, lapras-gmax
      [66, [[132] ]], // ditto
      [67, [[133, 10205], [134,135,136,196,197,470,471,700] ]],
      // eevee, eevee-gmax, vaporeon, jolteon, flareon, espeon, umbreon(197)
      // eevee also ID: 10159
      [68, [[137], [233], [474] ]], // porygon, porygon2, porygon-z
      [69, [[138], [139] ]], // omanyte, omastar
      [70, [[140], [141] ]], // kabuto, kabutops
      [71, [[142,10042] ]], // aerodactyle, aerodactyl-mega
      [72, [[446], [143,10206] ]], // munchlax, snorlax, snorlax-gmax
      [73, [[144,10169] ]], // articuno, articuno-galar
      [74, [[145,10170] ]], // zapdos, zapdos-galar
      [75, [[146,10171] ]], // moltres, moltres-galar
      [76, [[147], [148], [149] ]], // dratini, dragonair, dragonite
      [77, [[150,10043,10044] ]], // mewtwo, mewtwo-mega-x, mewtwo-mega-y
      [78, [[151] ]], // mew
      // /* End of Generation 1 */
      [79, [[152], [153], [154] ]], // chikorita, bayleef, meganium
      [80, [[155], [156], [157,10233] ]], // cyndaquil, quilava, typhlosion, typhlosion-hisui
      [81, [[158], [159], [160] ]], // totodile, croconaw, feraligatr
      [82, [[161], [162] ]], // sentret, furret
      [83, [[163], [164] ]], // hoothoot, noctowl
      [84, [[165], [166] ]], // ledyba, ledian
      [85, [[167], [168] ]], // spinarak, ariados
      [86, [[170], [171] ]], // chinchou, lanturn
      [87, [[175], [176], [468] ]], // togepi, togetic, togekiss
      [88, [[177], [178] ]], // natu, xatu
      [89, [[179], [180], [181,10045] ]], // mareep, flaaffy, ampharos, ampharos-mega
      [90, [[298], [183], [184] ]], // azurill, marill, azumarill
      [91, [[438], [185] ]], // bonsly, sudowoodo
      [92, [[187], [188], [189] ]], // hoppip, skiploom, jumpluff
      [93, [[190], [424] ]], // aipom, ambipom
      [94, [[191], [192] ]], // sunkern, sunflora
      [95, [[193], [469] ]], // yanma, yanmega
      [96, [[194], [195] ]], // wooper, quagsire
      [97, [[198], [430] ]], // murkrow, honchkrow
      [98, [[200], [429] ]], // misdreavus, mismagius
      [99, [[201] ]], // unown
      [100, [[360], [202] ]], // wynaut, wobbuffet
      [101, [[203] ]], // girafarig
      [102, [[204], [205] ]], // pineco, forretress
      [103, [[206] ]], // dunsparce
      [104, [[207], [472] ]], // gligar, gliscor
      [105, [[209], [210] ]], // snubbull, granbull
      [106, [[211,10234], [904] ]], // qwilfish, qwilfish-hisui, overqwil
      [107, [[213] ]], // shuckle
      [108, [[214,10047] ]], // heracross, heracross-mega
      [109, [[215,10235], [461,903] ]], // sneasel, sneasel-hisui, weavile (daytime and with Razor Claw) OR sneasler (nighttime with Razor Claw)
      [110, [[216], [217], [901] ]], // teddiursa, ursaring, ursaluna(peat block under full moon)
      [111, [[218], [219] ]], // slugma, magcargo
      [112, [[220], [221], [473] ]], // swinub, piloswine, mamoswine
      [113, [[222,10173], [864] ]], // corsola, corsola-galar, cursola
      [114, [[223], [224]]], // remoraid, octillery
      [115, [[225] ]], // delibird
      [116, [[458], [226] ]], // mantyke, mantine
      [117, [[227] ]], // skarmory
      [118, [[228], [229,10048] ]], // houndour, houndoom, houndoom-mega
      [119, [[231], [232] ]], // phanpy, donphan
      [120, [[234] ]], // stanler
      [121, [[235] ]], // smeargle
      [122, [[241] ]], // miltank
      [123, [[243] ]], // raikou
      [124, [[244] ]], // entei
      [125, [[245] ]], // suicune
      [126, [[246], [247], [248,10049] ]], // larvitar, pupitar, tyranitar, tyranitar-mega
      [127, [[249] ]], // lugia
      [128, [[250] ]], // ho-oh
      [129, [[251] ]], // celebi Page 26
      // /* End of Generation 2 */
      [130, [[252], [253], [254,10065] ]], // treeco, grovyle, sceptile, sceptile-mega
      [131, [[255], [256], [257,10050] ]], // torchic, combusken, blaziken, blaziken-mega
      [132, [[258], [259], [260,10064] ]], // mudkip, marshtomp, swampert, swampert-mega
      [133, [[261], [262] ]], // poochyena, mightyena
      [134, [[263,10174], [264,10175], [862] ]], // zigzagoon, zigzagoon-galar, linoone, linoone-galar, obstagoon
      [135, [[265], [266,268], [267,269] ]], // wurmple, silcoon, cascoon, beautifly, dustox
      [136, [[270], [271], [272] ]], // lotad, lombre, ludicolo
      [137, [[273], [274], [275] ]], // seedot, nuzleaf, shiftry
      [138, [[276], [277] ]], // taillow, swellow
      [139, [[278], [279]]], // wingull, pelipper
      [140, [[280], [281], [282,10051,475,10068] ]], // ralts, kirlia, gardevoir(30), gardevoir-mega gallade(dawn stone & male), gallade-mega
      [141, [[283], [284] ]], // surskit, masquerain
      [142, [[285], [286] ]], // shroomish, breloom
      [143, [[287], [288], [289] ]], // slakoth, vigoroth, slaking
      [144, [[290], [291], [292] ]], // nincada, ninjask, shedinja
      [145, [[293], [294], [295] ]], // whismur, loudred, exploud
      [146, [[296], [297] ]], // makuhita, harlyama
      [147, [[299], [476 ] ]], // nosepass, probopass(level up in magnetic field)
      [148, [[300], [301] ]], // skitty, delcatty
      [149, [[302,10066] ]], // sableye, sableye-mega
      [150, [[303,10052] ]], // mawile, mawile-mega
      [151, [[304], [305], [306,10053] ]], // aron, lairon, aggron, aggron-mega
      [152, [[307], [308,10054] ]], // meditite, medicham, medicham-mega
      [153, [[309], [310,10055] ]], // electrike, manectric, manectric-mega
      [154, [[311] ]], // plusle
      [155, [[312] ]], // minun
      [156, [[313] ]], // volbeat
      [157, [[314] ]], // illumise
      [158, [[406], [315], [407] ]], // budew(high friendship), roselia, roserade(shiny stone)
      [159, [[316], [317] ]], // gulpin, swalot
      [160, [[318], [319,10070] ]], // carvanha, sharpedo, sharpedo-mega
      [161, [[320], [321] ]], // wailmer, wailord
      [162, [[322], [323,10087] ]], //numel, camerupt, camerupt-mega
      [163, [[324] ]], // torkoal
      [164, [[325], [326] ]], // spoink, grumpig
      [165, [[327] ]], // spinda
      [166, [[328], [329], [330] ]], // trapinch, vibrava, flygon
      [167, [[331], [332] ]], // cacnea, cacturne
      [168, [[333], [334,10067] ]], // swablu, altaria, altaria-mega
      [169, [[335] ]], // zangoose
      [170, [[336] ]], // seviper
      [171, [[337] ]], // lunatone
      [172, [[338] ]], // solrock
      [173, [[339], [340] ]], // barboach, whiscash
      [174, [[341], [342] ]], // corphish, crawdaunt
      [175, [[343], [344] ]], // baltoy, claydol
      [176, [[345], [346] ]], // lileep, cradily
      [177, [[347], [348] ]], // anorith, armaldo
      [178, [[349], [350] ]], // feebas, milotic
      [179, [[351,10013,10014,10015] ]], // castform OTHER IMAGES with ID: 10013-10015
      [180, [[352] ]], // kecleon
      [181, [[353], [354,10056] ]], // shuppet, banette, banette-mega
      [182, [[355], [356], [477] ]], // duskull, dusclops, dusknoir(trade with reaper cloth)
      [183, [[357] ]], // tropius
      [184, [[433], [358]]], // chingling, chimecho
      [185, [[359,10057] ]], // absol, absol-mega
      [186, [[361], [362,10074,478] ]], // snorunt, glalie(level up), glalie-mega, froslass(dawn stone & female)
      [187, [[363], [364], [365] ]], // spheal, sealeo, walrein
      [188, [[366], [367], [368] ]], // clamperl, huntail, gorebyss
      [189, [[369] ]], // relicanth
      [190, [[370] ]], // luvdisc
      [191, [[371], [372], [373,10089] ]], // bagon, shelgon, salamence, salamence-mega
      [192, [[374], [375], [376,10076] ]], // beldum, metang, metagross, metagross-mega
      [193, [[377] ]], // regirock
      [194, [[378] ]], // regice
      [195, [[379] ]], // registeel
      [196, [[380,10062] ]], // latias, latias-mega
      [197, [[381,10063] ]], // latios, latios-mega
      [198, [[382,10077] ]], // kyogre, kyogre-primal
      [199, [[383,10078] ]], // groudon, groudon-primal
      [200, [[384,10079] ]], // rayquaza, rayquaza-primal
      [201, [[385] ]], // jirachi
      [202, [[386,10001,10002,10003] ]], // deoxys(normal) OTHER IMAGES with ID: 10001, 10002, 10003
      /* End of Generation 3 */
      [203, [[387], [388], [389] ]], // turtwig, grotle, torterra
      [204, [[390], [391], [392] ]], // chimchar, monferno, infernape
      [205, [[393], [394], [395] ]], // piplup, prinplup, empoleon
      [206, [[396], [397], [398] ]], // starly, staravia, staraptor
      [207, [[399], [400] ]], // bidoof, bibarel
      [208, [[401], [402] ]], // kricketot, kricketune
      [209, [[403], [404], [405] ]], // shinx, luxio, luxray
      /* 210 does not exist in evolution-chains call */
      [211, [[408], [409] ]], // cranidos, rampardos
      [212, [[410], [411] ]], // shieldon, bastiodon
      [213, [[412,10004,10005], [413], [414] ]], // burmy, wormadam-plant, mothim OTHER IMAGES for 412 with ID: 10004, 10005
      [214, [[415], [416] ]], // combee, vespiquen
      [215, [[417] ]], // pachirisu
      [216, [[418], [419] ]], // buizel, floatzel
      [217, [[420], [421] ]], // cherubi, cherrim
      [218, [[422], [423] ]], // shellos, gastrodon
      [219, [[425], [426] ]], // drifloon, drifblim
      [220, [[427], [428,10088] ]], // buneary, lopunny, lopunny-mega
      [221, [[431], [432] ]], // glameow, purugly
      [223, [[434], [435] ]], // stunky, skuntank
      /* 222 does not exist in evolution-chains call */
      [224, [[436], [437] ]], // bronzor, bronzong
      [228, [[441] ]], // chatot
      /* 225, 226, 227 does not exist in evolution-chains call */
      [229, [[442] ]], // spiritomb
      [230, [[443], [444], [445,10058] ]], // gible, gabite, garchomp, garchomp-mega
      /* 231 does not exist in evolution-chains call */
      [232, [[447], [448,10059] ]], // riolu, lucario, lucario-mega
      [233, [[449], [450] ]], // hippopotas, hippowdon
      [234, [[451], [452] ]], // skorupi, drapion
      [235, [[453], [454] ]], // croagunk, toxicroak
      [236, [[455] ]], // carnivine
      [237, [[456], [457] ]], // finneon, lumineon
      /* 238 does not exist in the evolution-chains call */
      [239, [[459], [460,10060] ]], // snover, abomasnow, abomasnow-mega
      [240, [[479,10008,10009,10010,10011,10012] ]], // rotom, OTHER IMAGES with ID: 10008-10012
      [241, [[480] ]], // uxie
      [242, [[481] ]], // mesprit
      [243, [[482] ]], // azelf
      [244, [[483,10245] ]], // dialga, dialga-origin
      [245, [[484,10246] ]], // palkia, palkia-origin
      [246, [[485] ]], // heatran
      [247, [[486] ]], // regigigas
      [248, [[487,10007] ]], // giratina,-altered OTHER IMAGES with ID: 10007
      [249, [[488] ]], // cresselia
      [250, [[489], [490] ]], // phione, manaphy
      /* 251 does not exist in the evolution-chains call */
      [252, [[491] ]], // darkrai
      [253, [[492,10006] ]], // shaymin-lang, shaymin-sky
      [254, [[493] ]], // arceus
      [255, [[494] ]], // victini
      /* End of Generation 4 */
      [256, [[495], [496], [497] ]], // snivy, servine, serperior
      [257, [[498], [499], [500] ]], // tepig, pignite, emboar
      [258, [[501], [502], [503,10236] ]], // oshawott, dewott, samurott, samurott-hisui
      [259, [[504], [505] ]], // patrat, watchog
      [260, [[506], [507], [508] ]], // lillipup, herdier, stoutland
      [261, [[509], [510] ]], // purrloin, liepard
      [262, [[511], [512] ]], // pansage, simisage
      [263, [[513], [514] ]], // pansear, simisear
      [264, [[515], [516] ]], // panpour, simipour
      [265, [[517], [518] ]], // munna, musharna
      [266, [[519], [520], [521] ]], // pidove, tranquill, unfezant
      [267, [[522], [523] ]], // blitzle, zebstrika
      [268, [[524], [525], [526] ]], // roggenrola, boldore, gigalith
      [269, [[527], [528] ]], // woobat, swoobat
      [270, [[529], [530] ]], // drilbur, excadrill
      [271, [[531,10069] ]], // audino, audino-mega
      [272, [[532], [533], [534] ]], // timburr, gurdurr, conkeldurr
      [273, [[535], [536], [537] ]], // tympole, palpitoad, seismitoad
      [274, [[538] ]], // throh
      [275, [[539] ]], // sawk
      [276, [[540], [541], [542] ]], // sewaddle, swadloon, leavanny
      [277, [[543], [544], [545] ]], // venipede, whirlipede, scolipide
      [278, [[546], [547] ]], // cottonee, whimsicott
      [279, [[548], [549,10237] ]], // petilil, lilligant, lilligant
      [280, [[550, 100016,10247], [902,10248] ]], // basculin-red-striped, basculin-blue-striped, basculin-white-striped, basculegion-male, basculegion-female
      [281, [[551], [552], [553] ]], // sandile, krokorok, krookodile
      [282, [[554, 10017,10176,10178], [555,10177] ]], // darumaka, darumaka-galar, darmanitan-zen, darmanitan-zen-galar, darmanitan-standard, darmanitan-galar-standard
      [283, [[556] ]], // maractus
      [284, [[557], [558] ]], // dwebble, crustle
      [285, [[559], [560] ]], // scraggy, scrafty
      [286, [[561] ]], // sigilyph
      [287, [[562,10179], [563,867] ]], // yamask(type:ghost) => cofagrigus(levelup:34), OR  yamask => runerigus(near dusty bowl), yamask-galar
      [288, [[564], [565] ]], // tirtouga, carracosta
      [289, [[566], [567] ]], // archen, archeops
      [290, [[568], [569,10207] ]], // trubbish, garbodor, garbodor-gmax
      [291, [[570,10238], [571,10239] ]], // zorua,zorua-hisui, zoroark, zoroark-hisui
      [292, [[572], [573] ]], // minccino, cinccino
      [293, [[574], [575], [576] ]], // gothita, gothorita, gothitelle
      [294, [[577], [578], [579] ]], // solosis, duosion, reuniclus
      [295, [[580], [581] ]], // ducklett, swanna
      [296, [[582], [583], [584] ]], // vanillite, vanillish, vanilluxe
      [297, [[585], [586] ]], // deerling, sawsbuck
      [298, [[587] ]], // emolga
      [299, [[588], [589] ]], // karrablast, escavalier
      [300, [[590], [591] ]], // foongus, amoonguss
      [301, [[592], [593] ]], // frillish, jellicent
      [302, [[594] ]], // alomomola
      [303, [[595], [596] ]], // joltik, galvantula
      [304, [[597], [598] ]], // ferroseed, ferrothorn
      [305, [[599], [600], [601] ]], // klink, klang, klinklang
      [306, [[602], [603], [604] ]], // tynamo, eelektrik, eelektross
      [307, [[605], [606] ]], // elgyem, beheeyem
      [308, [[607], [608], [609] ]], // litwick, lampent, chandelure
      [309, [[610], [611], [612] ]], // axew, fraxure, haxorus
      [310, [[613], [614] ]], // cubchoo, beatric
      [311, [[615] ]], // cryogonal
      [312, [[616], [617] ]], // shelmet, accelgor
      [313, [[618,10180] ]], // stunfisk, stunfisk-galar
      [314, [[619], [620] ]], // mienfoo, mienshao
      [315, [[621] ]], // druddigon
      [316, [[622], [623] ]], // golett, golurk
      [317, [[624], [625] ]], // pawniard, bisharp
      [318, [[626] ]], // bouffalant
      [319, [[627], [628,10240] ]], // rufflet, braviary, braviary-hisui
      [320, [[629], [630] ]], // vullaby, mandibuzz
      [321, [[631] ]], // heatmor
      [322, [[632] ]], // durant
      [323, [[633], [634], [635] ]], // deino, zweilous, hydreigon
      [324, [[636], [637] ]], // larvesta, volcarona
      [325, [[638] ]], // cobalion
      [326, [[639] ]], // terrakion
      [327, [[640] ]], // virizion
      [328, [[641,10019] ]], // tornadus-incarnate, tornadus-therian
      [329, [[642,10020] ]], // thundurus-incarnate, thundurus-therian
      [330, [[643,10021] ]], // reshiram, thundurus-therian
      [331, [[644] ]], // zekrom
      [332, [[645] ]], // landorus-incarnate
      [333, [[646,10022,10023] ]], // kyurem, kyurem-black, kyurem-white
      [334, [[647,10024] ]], // keldeo-ordinary, keldeo-resolute
      [335, [[648,10018] ]], // meloetta-aria, meloetta-pirouette
      [336, [[649] ]], // genesect
      // /* End of Generation 5 */
      [337, [[650], [651], [652] ]], // chespin, quilladin, chesnaught
      [338, [[653], [654], [655] ]], // fennekin, braixen, delphox
      [339, [[656], [657], [658,10116,10117] ]], // froakie, frogadier, greninja, greninja-battle-bond, greninja-ash
      [340, [[659], [660] ]], // bunnelby, diggersby
      [341, [[661], [662], [663] ]], // fletchling, fletchinder, talonflame
      [342, [[664], [665], [666] ]], // scatterbug, spewpa, vivillon
      [343, [[667], [668] ]], // litleo, pyroar
      [344, [[669], [670,10061], [671] ]], // flabebe, floette, floette-eternal, florges
      [345, [[672], [673] ]], // skiddo, gogoat
      [346, [[674], [675] ]], // pancham, pangoro
      [347, [[676] ]], // furfrou,
      [348, [[677], [678,10025] ]], // espurr, meowstic-male, meowstic-female
      [349, [[679], [680], [681,10026] ]], // honedge, doublade, aegislash-shield, aegislash-blade
      [350, [[682], [683] ]], // spritizee, aromatisse
      [351, [[684], [685] ]], // swirlix, slurpuff
      [352, [[686], [687] ]], // inkay, malamar
      [353, [[688], [689] ]], // binacle, barbaracle
      [354, [[690], [691] ]], // skrelp, dragalge
      [355, [[692], [693] ]], // clauncher, clawitzer
      [356, [[694], [695] ]], // helioptile, heliolisk
      [357, [[696], [697] ]], // tyrunt, tyrantrum
      [358, [[698], [699] ]], // amaura, aurorus
      [359, [[701] ]], // hawlucha
      [360, [[702] ]], // dedenne
      [361, [[703] ]], // carbink
      [362, [[704], [705,10241], [706,10242] ]], // goomy, sliggoo, sloggoo-hisui, goodra, goodra-hisui
      [363, [[707] ]], // klefki
      [364, [[708], [709] ]], // phantump, trevenant
      [365, [[710], [711] ]], // pumpkaboo-average, gourgeist-average
      [366, [[712], [713,10243] ]], // bergmite, avalugg, avalugg-hisui
      [367, [[714], [715] ]], // noibat, noivern
      [368, [[716] ]], // xerneas
      [369, [[717] ]], // yveltal
      [370, [[718,10118,10119,10181,10120] ]], // zygarde-50, zygarde-10-power-construct, zygarde-50-power-construct, zygarde-10, zygarde-complete
      [371, [[719,10075] ]], // diancie, diancie-mega
      [372, [[720,10086] ]], // hoopa, hoopa-unbound
      [373, [[721] ]], // volcanion
      // /* End of Generation 6 */
      [374, [[722], [723], [724,10244] ]], // rowlet, dartrix, decidueye, decidueye-hisui
      [375, [[725], [726], [727] ]], // litten, torracat, incineroar
      [376, [[728], [729], [730] ]], // popplio, brionne, primarina
      [377, [[731], [732], [733] ]], // pikipek, trumbeak, toucannon
      [378, [[734], [735,10121]]], // yungoos, gumshoos, gumshoos-totem
      [379, [[736], [737], [738,10122]]], // grubbin, charjabug, vikavolt, vikavolt-totem
      [380, [[739], [740]]], // crabrawler, crabominable
      [381, [[741,10123,10124,10125]]], // oricorio-baile, oricorio-pom-pom, oricorio-pau, oricorio-sensu
      [382, [[742], [743,10150]]], // cutiefly, ribombee, ribombee-totem
      [383, [[744,10151], [745,10126,10152]]], // rockruff, rockruff-own-tempo lycanroc-midday, lycanroc-midnight, lycanroc-dusk
      [384, [[746,10127]]], // wishiwashi-solo, wishiwashi-school
      [385, [[747], [748] ]], // mareanie, toxapex
      [386, [[749], [750] ]], // mudbray, mudsdale
      [387, [[751], [752,10153] ]], // dewpider, araquanid, araquanid-totem
      [388, [[753], [754,10128] ]], // fomantis, lurantis, lurantis-totem
      [389, [[755], [756] ]], // morelull, shiinotic
      [390, [[757], [758,10129] ]], // salandit, salazzle, salazzle-totem
      [391, [[759], [760] ]], // stufful, bewear
      [392, [[761], [762], [763]]], // bounsweet, steenee, tsareena
      [393, [[764] ]], // comfey
      [394, [[765] ]], // oranguru
      [395, [[766] ]], // passimian
      [396, [[767], [768]]], // wimpod, golisopod
      [397, [[769], [770]]], // sandygast, palossand
      [398, [[771]]], // pyukumuku
      [399, [[772], [773]]], // type-null, silvally
      [400, [[774,10130,10131,10132,10133,10134,10135,10136,10137,10138,10139,10140,10141,10142] ]],
      // minior-red-meteor, orange, yellow, green, blue, indio, violet; minior-red, orange, yellow, green, blue, indigo, violet
      [401, [[775] ]], // komala
      [402, [[776] ]], // turtonator
      [403, [[777,10154] ]], // togedemaru, togedemaru-totem
      [404, [[778,10143,10144,10145] ]], // mimikyu-disguised, mimikyu-busted, mimikyu-totem-disguised, mimikyu-totem-busted
      [405, [[779] ]], // bruxish
      [406, [[780] ]], // drampa
      [407, [[781] ]], // dhelmise
      [408, [[782], [783], [784,10146]]], // jangmo-o, hakamo-o, kommo-o, kommo-o-totem
      [409, [[785] ]], // tapu-koko
      [410, [[786] ]], // tapu-lele
      [411, [[787] ]], // tapu-bulu
      [412, [[788] ]], // tapu-fini
      [413, [[789], [790], [791], [792]]], // cosmog, cosmoem, solgaleo, lunala
      [414, [[793] ]], // nihilego
      [415, [[794] ]], // buzzwole
      [416, [[795] ]], // pheromosa
      [417, [[796] ]], // xurkitree
      [418, [[797] ]], // celesteela
      [419, [[798] ]], // kartana
      [420, [[799] ]], // guzzlord
      [421, [[800,10155,10156,10157] ]], // necrozma, necrozma-dusk, necrozma-dawn, necrozma-ultra
      [422, [[801,10147] ]], // magearna, magearna-original
      [423, [[802] ]], // marshadow
      [424, [[803], [804] ]], // poipole, naganadel
      [425, [[805] ]], // stakataka
      [426, [[806] ]], // blacephalon
      [427, [[807] ]], // zeraora
      [428, [[808], [809,10208] ]], // meltan, melmetal, melmetal-gmax
      //[429, [[809] ]], // melmetal
      // /* End of Generation 7 */
      [430, [[810], [811], [812,10209] ]], // grookey, thwackey, rillaboom, rillaboom-gmax
      [431, [[813], [814], [815,10210] ]], // scorbunny, raboot, cinderace, cinderace-gmax
      [432, [[816], [817], [818,10211] ]], // sobble, drizzile, inteleon, inteleon-gmax
      [433, [[819], [820] ]], // skwovet, greedent
      [434, [[821], [822], [823,10212] ]], // rookidee, corvisquire, corviknight, corviknight-gmax
      [435, [[824], [825], [826,10213] ]], // blipbug, dottler, orbeetle, orbeetle-gmax
      [436, [[827], [828] ]], // nickit, thievul
      [437, [[829], [830] ]], // gossifleur, eldegoss
      [438, [[831], [832] ]], // wooloo, dubwool
      [439, [[833], [834,10214] ]], // chewtle, drednaw, drednaw-gmax
      [440, [[835], [836] ]], // yamper, boltund
      [441, [[837], [838], [839,10215] ]], // rolycoly, carkol, coalossal, coalossal-gmax
      [442, [[840], [841,10216], [842,10217] ]], // applin, flapple, flapple-gmax, appletun, appletun-gmax
      [443, [[843], [844,10218] ]], // silicobra, sandaconda, sandaconda-gmax
      [444, [[845,10182,10183] ]], // cramorant, cramorant-gulping, gramorant-gorging
      [445, [[846], [847] ]], // arrokuda, barraskewda
      [446, [[848], [849,10219,10184,10228] ]], // toxel, toxtricity-amped, toxtricity-amped-gmax, toxtricity-low-key, toxtricity-low-key-gmax
      [447, [[850], [851,10220] ]], // sizzlipede, centiskorch, centiskorch-gmax
      [448, [[852], [853] ]], // clobbopus, grapploct
      [449, [[854], [855] ]], // sinistea, polteageist
      [450, [[856], [857], [858,10221] ]], // hatenna, hattrem, hatterene, hatterene-gmax
      [451, [[859], [860], [861,10222] ]], // impidimp, morgrem, grimmsnarl, grimmsnarl-gmax
      [452, [[868], [869,10223] ]], // milcery, alcremie, alcremie-gmax
      [453, [[870] ]], // falinks
      [454, [[871] ]], // pincurchin
      [455, [[872], [873]]], //snom, frosmoth
      [456, [[874] ]], // stonjourner
      [457, [[875,10185] ]], // eiscue-ice, eiscue-noice
      [458, [[876,10186] ]], // indeedee-male, indeedee-female
      [459, [[877,10187] ]], // morpeko-full-belly, morpeko-hangry
      [460, [[878], [879,10224] ]], // cufant, copperajah, copperajah-gmax
      [461, [[880] ]], // dracozolt
      [462, [[881] ]], // arctozolt
      [463, [[882] ]], // dracovish
      [464, [[883] ]], // arctovish
      [465, [[884,10225] ]], // duraludon, duraludon-gmax
      [466, [[885], [886], [887] ]], // dreepy, drakloak, dragapult
      [467, [[888,10188] ]], // zacian, zacian-crowned
      [468, [[889,10189] ]], // zamazenta, zamazenta-crowned
      [469, [[890,10190] ]], // eternatus, eternatus-eternamax
      [470, [[891], [892,10191,10226,10227] ]], // kubfu, urshifu-single-strike, urshifu-rapid-strike, single-strike-gmax, rapid-strike-gmax
      [471, [[893,10192] ]], // zarude, zarude-dada
      [472, [[894] ]], // regieleki
      [473, [[895] ]], // regidrago
      [474, [[896] ]], // glastrier
      [475, [[897] ]], // spectrier
      [476, [[898,10193,10194] ]], // calyrex, calyrex-ice, calyrex-shadow
      [477, [[899] ]], // wyrdeer
      [478, [[905,10249] ]], // enamorus, enamorus-therian
      [479, [[10027,10028,10029], [10030,10031,10032]]], // pumpkaboo-small, large, super, gorgeist-small, large, super
      /* End of generation 8 */
    ]);
  }

  // attributes map for each pokemon, which holds ALL evolution details
  generateDefaultAttributesMap() {
    return new Map<string, any>([
      ["name", null ],
      ["gender", null ],
      ["is_baby", null ],
      ["held_item", null ], // on screen
      ["use_item", null ], //  on screen
      ["known_move", null ],
      ["location", null ],
      ["min_affection", null ],
      ["min_beauty", null ],
      ["min_happiness", null ], // on screen
      ["min_level", null ],
      ["needs_rain", null ],
      ["time_of_day", null ],
      ["known_move", null ],
      ["known_move_type", null ],
      ["party_species", null ],
      ["relative_physical_stats", null ],
      ["trade_species", null ],
      ["turn_upside_down", null ]
    ])
  }

  getEvolutionChainID(pokemonID: number): number {
    let keys = Array.from(this.pokemonIDToEvolutionChainMap.keys());
    //console.log("map keys", keys);
    let keyToReturn = 0;
    keys.forEach(key => {
      if (keyToReturn == 0) { // stop looping after chainID is found
        let pokemonIDs = this.pokemonIDToEvolutionChainMap.get(key);
        let ids: any[] = [];
        // @ts-ignore
        pokemonIDs.forEach(id => ids.push(id));
        //console.log("key: ", key, " ids: ", ids.toString())
        // @ts-ignore
        for(let listIndex=0; listIndex<pokemonIDs.length; listIndex++) {
          // @ts-ignore
          let chainIDs = pokemonIDs[listIndex];
          chainIDs.forEach(chainID => {
            if (pokemonID == chainID) {
              // @ts-ignore
              //console.log(pokemonID + " found with key", key);
              console.log("pokemonChainID: ", key);
              keyToReturn = key;
              return;
            }
          });
        }
      }
    });
    return keyToReturn;
  }

  getPokemonSprites(pokemonID: any): any {
    this.pokemonService.getPokemonByName(pokemonID)
      .then((pokemon: any) => {
        let sprites = pokemon['sprites'];
        let otherSprites = sprites['other'];
        //console.log("getPokemonSpritesEvolutions");
        //console.log(sprites['front_default']);
        let frontImg = sprites['front_default'];
        this.defaultImagePresent = frontImg != null;
        let shinyImg = sprites['front_shiny'];
        let officialImg = otherSprites['official-artwork'].front_default;
        let gifImg = pokemon['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
        this.gifImagePresent = gifImg != null;
        this.sprites = {
          front: frontImg,
          shiny: shinyImg,
          official: officialImg,
          gif: gifImg
        };
      });
    //console.log("theSprites: ", this.sprites);
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

  setFamilySize() {
    Array.from(this.pokemonFamilyIDs).forEach(idList => {
      Array.from(idList).forEach((id: any) => {
        this.pokemonFamilySize += 1;
      });
    });
    //console.log("familySize:", this.pokemonFamilySize);
  }

  setStages() {
    Array.from(this.pokemonFamilyIDs).forEach(idList => {
      this.stages.push(++this.stage);
    })
    //console.log("stages: ", this.stages.length);
  }

  setAllIDs() {
    Array.from(this.pokemonFamilyIDs).forEach(idList => {
      Array.from(idList).forEach((id: any) => {
        this.allIDs.push(id);
      });
    });
    this.allIDs.sort(function (a, b) { return a-b; })
    //console.log("allIDs: ", this.allIDs);
  }

  createListOfPokemonForIDList(idList: any[]) {
    console.log("IDList: ", idList, " length: ", idList.length)
    let pokemonList: any[] = [];
    Array.from(idList).forEach((id: any) => {
      console.log("id: ",id);
      pokemonList = [];
      this.pokemonService.getPokemonByName(id)
        .then((pokemonResponse: any) => {
          this.pokemonService.getPokemonSpeciesData(pokemonResponse['species'].url) // pokemonResponse['species'].url
            .then( (speciesData: any) => {
              let pokemon = this.createPokemon(pokemonResponse, speciesData);
              pokemonList.push(pokemon);
            });
        })
      //pokemonList.sort(function (a, b) { return a.id-b.id; });
      //console.log("adding list to familyList: ", pokemonList, " length is ", pokemonList.length)
      //this.pokemonFamily.push(pokemonList);
    })
    pokemonList.sort(function (a, b) { return a.id-b.id; });
    console.log("adding list to familyList: ", pokemonList, " length is ", pokemonList.length)
    this.pokemonFamily.push(pokemonList);
  }

  resetEvolutionParameters() {
    this.pokemonFamily = []
    this.pokemonFamilySize = 0
    //this.pokemonFamilyLevelsMap = new Map<number, number>()
    this.pokemonFamilyAltLevels = []
    //this.isBabyPokemonMap = new Map<number, boolean>()
    //this.specificAttributesMap = new Map<string, any>()
    this.allIDs = []
    this.stages = []
    this.stage = 0
    this.counter = 0
    //this.babyCounter = 0;
  }

  createPokemon(pokemonResponse: any, speciesData: any): any {
    let types = pokemonResponse.types;
    let pokemonType = '';
    if (types.length > 1)
    {
      pokemonType = types[0].type.name[0].toUpperCase()+types[0].type.name.substring(1) + " & " + types[1].type.name[0].toUpperCase()+types[1].type.name.substring(1);
    }
    else
    {
      pokemonType = types[0].type.name[0].toUpperCase()+types[0].type.name.substring(1);
    }
    let sprites = pokemonResponse['sprites'];
    let otherSprites = sprites['other'];
    //console.log("getPokemonSpritesEvolutions");
    //console.log(sprites['front_default']);
    let frontImg = sprites['front_default'];
    this.defaultImagePresent = frontImg != null;
    let shinyImg = sprites['front_shiny'];
    let officialImg = otherSprites['official-artwork'].front_default;
    let gifImg = pokemonResponse['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
    //console.log("MAP size", this.attrMapNew.size)
    //console.log("attrMap for pokemon: ",pokemonResponse.name, " ", this.pokemonIdAndAttributesMap.get(pokemonResponse.id))
    //let specifics = this.pokemonIdAndAttributesMap.get(pokemonResponse.id); // is a map
    // @ts-ignore
    //let level = <any>specifics.get("min_level")
    //console.log("res.id[",pokemonResponse.id,"]")
    //console.log("level[", level, "]"," name[",pokemonResponse.name,"]")
    // @ts-ignore
    //let isBabyPokemon = <boolean>specifics.get("is_baby")
    //console.log(pokemonResponse.name, " isBaby: ", this.isBabyPokemonMap.get(pokemonResponse.id));
    // check pokemonResponse.id with chainMap
    //let chainIDToCheck = this.getEvolutionChainID(pokemonResponse.id);
    //let idsInChainCheck = this.pokemonIDToEvolutionChainMap.get(chainIDToCheck); // ex: [[19,10091], [20,10092,10093] ]]
    //let listCount = 0;
    // //@ts-ignore
    // idsInChainCheck.every(listOfIDs => {
    //   let found = false;
    //   if (listOfIDs.includes(pokemonResponse.id)) {
    //     found = true;
    //     let idToUse = listOfIDs[0];
    //     // @ts-ignore
    //     level = this.pokemonIdAndAttributesMap.get(idToUse).get("min_level")
    //     // if is a gmax pokemon, set to 0
    //     if (pokemonResponse.name.split("-")[1] === "gmax") {
    //       level = null;
    //     }
    //     return;
    //   }
    //   if (found) return false; // to break out of every
    //   else listCount += 1;
    // })
    // listCount = 0;
    // //item. item can be different. not always the same
    // // @ts-ignore
    // //let evolvesWithItem = <any>specifics.get("use_item")
    // //console.log("evolvesWithItem: ", evolvesWithItem)
    // // @ts-ignore
    // idsInChainCheck.every(listOfIDs => {
    //   let found = false;
    //   if (pokemonResponse.name.split("-")[1] === "gmax") {
    //     evolvesWithItem = null;
    //     return false;
    //   }
    //   if (listOfIDs.includes(pokemonResponse.id)) {
    //     found = true;
    //     let idToUse = listOfIDs[0];
    //     // @ts-ignore
    //     evolvesWithItem = this.pokemonIdAndAttributesMap.get(idToUse).get("use_item")
    //     if (evolvesWithItem != null && !(evolvesWithItem instanceof Array)) {
    //       evolvesWithItem = this.checkTypeAndUpdateIfNecessary(pokemonResponse.id, evolvesWithItem, pokemonResponse.types)
    //     } else {
    //       // @ts-ignore
    //       evolvesWithItem = this.pokemonIdAndAttributesMap.get(idToUse).get("use_item")
    //     }
    //   }
    //   if (found) return false; // to break out of every
    //   else listCount += 1;
    // })
    //listCount = 0;
    //let doesEvolveWithItem = evolvesWithItem != null
    // min hap
    // @ts-ignore
    //let minHappiness = <number>specifics.get("min_happiness")
    //let evolvesByHappinessAttribute = minHappiness != null
    // held_item
    // @ts-ignore
    //let held_item = <any>specifics.get("held_item")
    //let doesEvolveWithHeldItem = held_item != null
    // evolving can occur based on level, item, or specific attribute
    //this.doesPokemonEvolve = this.determineIfPokemonEvolves(level, isBabyPokemon, doesEvolveWithItem, doesEvolveWithHeldItem, evolvesByHappinessAttribute)
    // edit weight
    let adjustedWeight = pokemonResponse.weight.toString()
    //console.log("'"+weight.slice(0,-1)+"'" + "." + "'"+weight.slice(-1)+"'")
    adjustedWeight = adjustedWeight.slice(0,-1) + '.' + adjustedWeight.slice(-1)
    //pokemon.weight = weight
    // edit height
    let adjustedHeight = pokemonResponse.height.toString();
    if (adjustedHeight.length == 1) adjustedHeight = "0." + adjustedHeight
    else adjustedHeight = adjustedHeight.slice(0,-1) + '.' + adjustedHeight.slice(-1)
    //pokemon.height = height;
    let pokemon = {
      id: pokemonResponse.id,
      name: pokemonResponse.name,
      height: adjustedHeight,
      weight: adjustedWeight,
      color: speciesData['color'].name,
      type: pokemonType,
      photo: this.defaultImagePresent ? frontImg : officialImg
    }
      //evolutionLevel: level,
      //evolves: this.doesPokemonEvolve,
      //doesEvolvesWithItem: doesEvolveWithItem,
      //evolvesByUsingItem: evolvesWithItem,
      //doesEvolveWithHeldItem: doesEvolveWithHeldItem,
      //held_item: held_item,
      //evolvesByHappinessAttribute: evolvesByHappinessAttribute,
      //happinessAttribute: minHappiness,
      //isBaby: isBabyPokemon //this.isBabyPokemonMap.get(pokemonResponse.id)
    //}
    //console.log("pokemon: ", pokemon)
    //console.log("attrMap for pokemon after: ",pokemonResponse.name, " ", this.attrMapNew.get(pokemonResponse.id))
    return pokemon;
  }

  // determineIfPokemonEvolves(level: any, isBabyPokemon: boolean, evolvesWithItem: any, evolvesWithHeldItem: any, evolvesByHappinessAttribute: any) {
  //   return (level > 0 || level!=null) ||
  //     isBabyPokemon ||
  //     evolvesWithItem ||
  //     evolvesWithHeldItem ||
  //     evolvesByHappinessAttribute
  // }

  // getEvolutionDetails(chain: any) {
  //   //console.log("chain: ",chain);
  //   let name = chain['species'].name
  //   let pkmnId = chain['species'].url.split("/")[6]
  //   let evolutionDetails: any;
  //   //console.log("name: ", name, " id: ", pkmnId)
  //   for (let i = 0; i < chain['evolves_to'].length; i++) {
  //     let evolvesTo = chain['evolves_to'][i]
  //     for (let j=0; j < evolvesTo['evolution_details'].length; j++) {
  //       // possibility of multiple evolution_details
  //       evolutionDetails = evolvesTo['evolution_details'][j]
  //       evolutionDetails.isBaby = chain.is_baby
  //       evolutionDetails.id = pkmnId
  //       evolutionDetails.name = name
  //       // setup attributesMap
  //       if (this.pokemonIdAndAttributesMap.get(Number.parseInt(pkmnId)) == null) {
  //         this.setAttributesMap(evolutionDetails);
  //       } else {
  //         this.updateAttributesMap(evolutionDetails, <Map<string, any>>this.pokemonIdAndAttributesMap.get(Number.parseInt(pkmnId)))
  //       }
  //       //this.pokemonIdAndAttributesMap.set(pkmnId, this.specificAttributesMap);
  //       //this.specificAttributesMap = this.generateDefaultAttributesMap()
  //       //console.log("evolution_details for:", name, " id: ", pkmnId, " ", evolutionDetails)
  //       this.getEvolutionDetails(evolvesTo) //, attributesMap, pokemonMap)
  //     }
  //     if (evolvesTo['evolves_to'].length > 0) {
  //       if (evolvesTo['evolves_to'].length > 1) {console.log("Printing final stage names")}
  //       else {console.log("Printing final stage name")}
  //       for (let j=0; j<evolvesTo['evolves_to'].length; j++) {
  //         //console.log(evolvesTo['evolves_to'][j]['species'])
  //         name = evolvesTo['evolves_to'][j]['species'].name
  //         pkmnId = evolvesTo['evolves_to'][j]['species'].url.split("/")[6]
  //         evolutionDetails = []//
  //         // evolvesTo['evolves_to'][j]['evolution_details'][0]
  //         evolutionDetails.isBaby = evolvesTo.is_baby
  //         evolutionDetails.id = pkmnId
  //         evolutionDetails.name = name
  //         this.setAttributesMap(evolutionDetails)
  //         this.pokemonIdAndAttributesMap.set(Number.parseInt(pkmnId), this.specificAttributesMap)
  //       }
  //       //printPokemonMap(pokemonMap)
  //     }
  //     else {
  //       //console.log("All Pokemon discovered")
  //     }
  //   }
  //   //console.log("Reset attributesMap for next Pokemon")
  //   //attributesMap = createAttributesMap(); // reset
  // }

  // updateAttributesMap(details: any, attributesMap: Map<string, any>) {
  //   //console.log("updating map for:", attributesMap.get("name"), " ", details)
  //   console.log("evolution_detailsU for:", attributesMap.get("name"), " ", details)
  //   //attributesMap.set("name", attributesMap.get("name"))
  //   if (details?.gender != null) {
  //     if (attributesMap.get("gender") == null) {
  //       attributesMap.set("gender",details.gender)
  //     } else {
  //       let gender = attributesMap.get("gender")
  //       let newGender = details?.gender
  //       let genders = (gender instanceof Array) ? gender : Array.of(gender)
  //       genders.push(newGender)
  //       attributesMap.set("gender", genders)
  //     }
  //   }
  //   if (details?.held_item != null) {
  //     if (attributesMap.get("held_item") == null) {
  //       attributesMap.set("held_item", Array.of(details.held_item.name))
  //     } else {
  //       let heldItem = attributesMap.get("held_item")
  //       let newHeldItem = details.held_item.name
  //       let heldItems = (heldItem instanceof Array) ? heldItem : Array.of(heldItem)
  //       heldItems.push(newHeldItem)
  //       attributesMap.set("held_item", heldItems)
  //     }
  //   }
  //   if (details?.item != null) {
  //     if (attributesMap.get("use_item") == null) {
  //       attributesMap.set("use_item", Array.of(details.item.name))
  //     } else {
  //       let item = attributesMap.get("use_item")
  //       let newItem = details.item.name
  //       let items = (item instanceof Array) ? item : Array.of(item)
  //       items.push(newItem)
  //       attributesMap.set("use_item", items)
  //     }
  //   }
  //   if (details?.min_happiness != null) {
  //     if (attributesMap.get("min_happiness") == null) {
  //       attributesMap.set("min_happiness", Array.of(details.min_happiness))
  //     } else {
  //       let minHappy = attributesMap.get("min_happiness")
  //       let newMinHappy = details.min_happiness
  //       let happinesses = (minHappy instanceof Array) ? minHappy : Array.of(minHappy)
  //       happinesses.push(newMinHappy)
  //       attributesMap.set("min_happiness", happinesses)
  //     }
  //   }
  //   if (details?.time_of_day != null && details?.time_of_day !== '') {
  //     if (attributesMap.get("time_of_day") == null) {
  //       attributesMap.set("time_of_day", Array.of(details.time_of_day))
  //     } else {
  //       let timeOfDay = attributesMap.get("time_of_day")
  //       let newTimeOfDay = details.time_of_day
  //       let timeOfDays = (timeOfDay instanceof Array) ? timeOfDay : Array.of(timeOfDay)
  //       timeOfDays.push(newTimeOfDay)
  //       attributesMap.set("time_of_day", timeOfDays)
  //     }
  //   }
  //   if (details?.location != null) {
  //     if (attributesMap.get("location") == null) {
  //       attributesMap.set("location", Array.of(details.location.name))
  //     } else {
  //       let location = attributesMap.get("location")
  //       let newLocation = details.location.name
  //       let locations = (location instanceof Array) ? location : Array.of(location)
  //       locations.push(newLocation)
  //       attributesMap.set("location", locations)
  //     }
  //   }
  //   if (details?.needs_overworld_rain != null) {
  //     if (attributesMap.get("needs_rain") == null) {
  //       attributesMap.set("needs_rain", Array.of(details.needs_overworld_rain))
  //     } else {
  //       let needsRain = attributesMap.get("needs_rain")
  //       let newNeedsRain = details.needs_overworld_rain
  //       let needsRains = (needsRain instanceof Array) ? needsRain : Array.of(needsRain)
  //       needsRains.push(newNeedsRain)
  //       attributesMap.set("needs_rain", needsRains)
  //     }
  //   }
  //   if (details?.min_affection != null) {
  //     if (attributesMap.get("min_affection") == null) {
  //       attributesMap.set("min_affection", Array.of(details.min_affection))
  //     } else {
  //       let minAffection = attributesMap.get("min_affection")
  //       let newMinAffection = details.min_affection
  //       let minAffections = (minAffection instanceof Array) ? minAffection : Array.of(minAffection)
  //       minAffections.push(newMinAffection)
  //       attributesMap.set("min_affection", minAffections)
  //     }
  //   }
  //   if (details?.min_beauty != null) {
  //     if (attributesMap.get("min_beauty") == null) {
  //       attributesMap.set("min_beauty", Array.of(details.min_beauty))
  //     } else {
  //       let minBeauty = attributesMap.get("min_beauty")
  //       let newMinBeauty = details.min_beauty
  //       let minBeauties = (minBeauty instanceof Array) ? minBeauty : Array.of(minBeauty)
  //       minBeauties.push(newMinBeauty)
  //       attributesMap.set("min_beauty", minBeauties)
  //     }
  //   }
  //   if (details?.known_move != null) {
  //     if (attributesMap.get("known_move") == null) {
  //       attributesMap.set("known_move", Array.of(details.known_move.name))
  //     } else {
  //       let knownMove = attributesMap.get("known_move")
  //       let newKnownMove = details.known_move.name
  //       let knownMoves = (knownMove instanceof Array) ? knownMove : Array.of(knownMove)
  //       knownMoves.push(newKnownMove)
  //       attributesMap.set("known_move", knownMoves)
  //     }
  //   }
  //   if (details?.known_move_type != null) {
  //     if (attributesMap.get("known_move_type") == null) {
  //       attributesMap.set("known_move_type", Array.of(details.known_move_type.name))
  //     } else {
  //       let knownMoveType = attributesMap.get("known_move_type")
  //       let newKnownMoveType = details.known_move_type.name
  //       let knownMoveTypes = (knownMoveType instanceof Array) ? knownMoveType : Array.of(knownMoveType)
  //       knownMoveTypes.push(newKnownMoveType)
  //       attributesMap.set("known_move_type", knownMoveTypes)
  //     }
  //   }
  //   if (details?.party_species != null) {
  //     if (attributesMap.get("party_species") == null) {
  //       attributesMap.set("party_species", Array.of(details.party_species))
  //     } else {
  //       let partySpecies = attributesMap.get("party_species")
  //       let newPartySpecies = details.party_species
  //       let partySpeciesList = (partySpecies instanceof Array) ? partySpecies : Array.of(partySpecies)
  //       partySpeciesList.push(newPartySpecies)
  //       attributesMap.set("party_species", partySpeciesList)
  //     }
  //   }
  //   if (details?.relative_physical_stats != null) {
  //     if (attributesMap.get("relative_physical_stats") == null) {
  //       attributesMap.set("relative_physical_stats", Array.of(details.relative_physical_stats))
  //     } else {
  //       let relPhysicalStat = attributesMap.get("relative_physical_stats")
  //       let newRelPhysicalStat = details.relative_physical_stats
  //       let relPhysicalStats = (relPhysicalStat instanceof Array) ? relPhysicalStat : Array.of(relPhysicalStat)
  //       relPhysicalStats.push(newRelPhysicalStat)
  //       attributesMap.set("relative_physical_stats", relPhysicalStats)
  //     }
  //   }
  //   if (details?.trade_species != null) {
  //     if (attributesMap.get("trade_species") == null) {
  //       attributesMap.set("trade_species", Array.of(details.trade_species))
  //     } else {
  //       let tradeSpecies = attributesMap.get("trade_species")
  //       let newTradeSpecies = details.trade_species
  //       let tradeSpeciesList = (tradeSpecies instanceof Array) ? tradeSpecies : Array.of(tradeSpecies)
  //       tradeSpeciesList.push(newTradeSpecies)
  //       attributesMap.set("trade_species", tradeSpeciesList)
  //     }
  //   }
  //   if (details?.turn_upside_down != null) {
  //     if (attributesMap.get("turn_upside_down") == null) {
  //       attributesMap.set("turn_upside_down", Array.of(details.turn_upside_down))
  //     } else {
  //       let turnUpsideDown = attributesMap.get("turn_upside_down")
  //       let newTurnUpsideDown = details.turn_upside_down
  //       let turnUpsideDownList = (turnUpsideDown instanceof Array) ? turnUpsideDown : Array.of(turnUpsideDown)
  //       turnUpsideDownList.push(newTurnUpsideDown)
  //       attributesMap.set("turn_upside_down", turnUpsideDownList)
  //     }
  //   }
  //   this.pokemonIdAndAttributesMap.set(Number.parseInt(details.id), attributesMap)
  //   //return this.specificAttributesMap;
  // }

  // setAttributesMap(details: any) {
  //   console.log("evolution_details for:", details.name, " ", details)
  //   this.specificAttributesMap = this.generateDefaultAttributesMap()
  //   //if (details == null) return attributesMap
  //   if (this.specificAttributesMap.get("name") == null) this.specificAttributesMap.set("name", details.name)
  //   if (this.specificAttributesMap.get("gender") == null) this.specificAttributesMap.set("gender", details?.gender ? details.gender : null)
  //   if (this.specificAttributesMap.get("is_baby") == null) this.specificAttributesMap.set("is_baby", details?.isBaby)
  //   if (this.specificAttributesMap.get("held_item") == null) {
  //     this.specificAttributesMap.set("held_item", details?.held_item?.name ? Array.of(details.held_item.name) : null)
  //   }
  //   if (this.specificAttributesMap.get("use_item") == null) {
  //     this.specificAttributesMap.set("use_item", details?.item?.name ? Array.of(details.item.name) : null)
  //   }
  //   if (this.specificAttributesMap.get("min_happiness") == null) {
  //     this.specificAttributesMap.set("min_happiness", details?.min_happiness ? Array.of(details.min_happiness) : null)
  //   }
  //   if (this.specificAttributesMap.get("min_level") == null) {
  //     this.specificAttributesMap.set("min_level", details?.min_level ? Array.of(details.min_level) : null)
  //   }
  //   if (this.specificAttributesMap.get("time_of_day") == null) {
  //     if (details?.time_of_day == null && details?.time_of_day !== '') {
  //       this.specificAttributesMap.set("time_of_day", details?.time_of_day ? Array.of(details.time_of_day) : null)
  //     }
  //   }
  //   if (this.specificAttributesMap.get("location") == null) {
  //     this.specificAttributesMap.set("location", details?.location?.name ? Array.of(details.location.name) : null)
  //   }
  //   if (this.specificAttributesMap.get("needs_rain") == null) {
  //     this.specificAttributesMap.set("needs_rain", details.needs_overworld_rain != null ? Array.of(details.needs_overworld_rain) : null)
  //   }
  //   if (this.specificAttributesMap.get("min_affection") == null) {
  //     this.specificAttributesMap.set("min_affection", details?.min_affection != null ? Array.of(details.min_affection) : null)
  //   }
  //   if (this.specificAttributesMap.get("min_beauty") == null) {
  //     this.specificAttributesMap.set("min_beauty", details?.min_beauty ? Array.of(details.min_beauty) : null)
  //   }
  //   if (this.specificAttributesMap.get("known_move") == null) {
  //     this.specificAttributesMap.set("known_move", details?.known_move?.name ? Array.of(details.known_move.name) : null)
  //   }
  //   if (this.specificAttributesMap.get("known_move_type") == null) {
  //     this.specificAttributesMap.set("known_move_type", details?.known_move_type?.name ? Array.of(details.known_move_type.name) : null)
  //   }
  //   if (this.specificAttributesMap.get("party_species") == null) {
  //     this.specificAttributesMap.set("party_species", details?.party_species ? Array.of(details.party_species) : null)
  //   }
  //   if (this.specificAttributesMap.get("relative_physical_stats") == null) {
  //     this.specificAttributesMap.set("relative_physical_stats", details?.relative_physical_stats ? Array.of(details.relative_physical_stats) : null)
  //   }
  //   if (this.specificAttributesMap.get("trade_species") == null) {
  //     this.specificAttributesMap.set("trade_species", details?.trade_species ? Array.of(details.trade_species) : null)
  //   }
  //   if (this.specificAttributesMap.get("turn_upside_down") == null) {
  //     this.specificAttributesMap.set("turn_upside_down", details?.turn_upside_down ? Array.of(details.turn_upside_down) : null)
  //   }
  //   this.pokemonIdAndAttributesMap.set(Number.parseInt(details.id), this.specificAttributesMap)
  // }

  // cleanupAttributesMap() {
  //   console.log("All attributes maps created: ", this.pokemonIdAndAttributesMap.size)
  //   Array.from(this.pokemonIdAndAttributesMap).forEach((innerMap) => {
  //     console.log("id: ", innerMap[0], " , map: ", innerMap[1])
  //     // clean up map, remove unnecessary duplicates
  //     // clean up min_happiness
  //     let minHappinessValues = innerMap[1].get("min_happiness")
  //     if (minHappinessValues != null) {
  //       let minHappinessSet = new Set()
  //       minHappinessValues.forEach((value: any) => {
  //         if (!minHappinessSet.has(value)) minHappinessSet.add(value)
  //       })
  //       innerMap[1].set("min_happiness", [...minHappinessSet].join(' '))
  //       this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
  //     }
  //   })
  // }

  // checkTypeAndUpdateIfNecessary(id: number, item: any, pokemonType: any): string {
  //   let type1, type2
  //   let returnItem = ''
  //   let itemFirstPart = item.split("-") // ex: ice-stone, thunder-stone ....
  //   // if one type
  //   if (pokemonType.length == 1) {
  //     type1 = pokemonType[0].type.name
  //     if (itemFirstPart != type1)
  //       returnItem = type1+"-stone"
  //   }
  //   // if two types
  //   else {
  //     type1 = pokemonType[0].type.name
  //     type2 = pokemonType[1].type.name
  //     if (itemFirstPart != type1)
  //       returnItem = type1+"-stone"
  //     else if (itemFirstPart != type2)
  //       returnItem = type2+"-stone"
  //     else
  //       returnItem = item;
  //   }
  //   console.log("returnItem: ", returnItem)
  //   return returnItem;
  // }
}
