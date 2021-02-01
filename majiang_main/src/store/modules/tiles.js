// import io from "socket.io-client";
// let socket = io("http://192.168.1.76:3000");
// import {yourStartTiles} from 'majiangArray'
const state = {
  // east: 0,
  // south: 1,
  // west: 2,
  // north: 3,
  players: [],
  dicedNumber: [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ],

  tilesAll: [], //full set of mahjiang tiles
  tilesOnHands: [], //four private of tiles randomly made of full set
  meldedTiles: [[], [], [], []], //discarded from each players

  publicTiles: [], //leftover for outgiving to players

  // suites: ['tiao', 'wan', 'circle'],
  // dragon: ['red_zhoung', 'facai', 'baiban'],
  // season: [],
  // flower: [],
  // wind: ['east_wind', 'south_wind', 'west_wind', 'north_wind'],
  order: [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ],
};

const actions = {
  startTiles({ commit }, arg) {
    commit("allTiles", arg.allTiles); 
    commit("setTiles",      arg.onHands);
    commit("setPublicTiles", arg.onTable);
  },
  tileChosen({ commit }, arg) {
    commit("tileChosen", arg);
  },
  setPlayers({commit}, arg) {
    commit('players', arg);
  },
  updMeldedTile({ commit }, arg) {
    commit("tileMelded", arg);
  },
  updPublicTiles1({ commit }, arg) {
    commit("outGivingPubTile1", arg);
  },
  setluckyNumber({ commit }, arg) {
    commit("myNumber", arg);
  },
  updTiles({ commit }, arg) {
    commit("sortGrouping", arg);
  },
  // updPublicTiles2({commit}, arg){
  //   commit('outGivingPubTile2', arg)
  // },
};

const mutations = {
  allTiles: (state, arg) => (state.tilesAll = arg), //all washed tiles to start
  setTiles: (state, arg) => (state.tilesOnHands = arg),//yourStartTiles()), //in hands of 4 players
  setPublicTiles: (state, arg) => (state.publicTiles =arg),// publicWall(state.tilesAll)), //left on table center
  players: (state, arg) => (state.players = arg),
  tileChosen: (state, arg) =>
    state.tilesOnHands[arg[0]].filter(function(e) {
      if (e.id === arg[1]) {
        e.chosen = !e.chosen;
      }
    }), //chosen to do something
  tileMelded: (state, arg) => state.meldedTiles[arg[1]].push(arg[0]), //used
  outGivingPubTile1: (state, arg) => {
    let a = state.publicTiles.shift();
    if (state.tilesOnHands[arg].length < 13) {
      state.tilesOnHands[arg].push(a);
    }
  }, //tiles for each player
  myNumber: (state, arg) => {
    state.dicedNumber.splice(arg[0], 1, arg[1]); //have error here?
    //emit to server
    //socket.emit("diceNumber", state.dicedNumber);
  }, //diced numbers from each
  sortGrouping: (state, arg) => {
    let copy = state.tilesOnHands.slice();
    copy[arg] = sortGroupingMyTiles(state.tilesOnHands[arg]);
    state.tilesOnHands = copy;
  }, //sorted tiles onhands
  // outGivingPubTile2: (state, arg)=>state.tiles[arg].push(state.publicTiles.pop()),
};

// meldedTiles: state=>state.meldedTiles=tileMaker(),
const getters = {
  getTiles: (state) => (index) => {
    state.tilesOnHands[index];
    return state.tilesOnHands[index];
  },
  // getAllTiles: state => state.tilesAll,
  getMeldedTiles: (state) => (index) => state.meldedTiles[index],
  getDicedNumber: (state) => state.dicedNumber,
  getPublicTiles: (state) => (index) => {
    if (state.tilesOnHands[index].length < 14) {
      state.tilesOnHands[index].push(state.publicTiles.pop());
    }
  },
  getPlayers: (state) => state.players,
};
export default {
  state,
  getters,
  actions,
  mutations,
};

// function to generate collection of tiles
// socket.on("Full", () => {
  // window.console.log("the store has connected to server!");
//});
//function tileMaker() {
// let id = 0;
// let tiles = [];
////let publicTiles = [];
// let suites_name = ["tiao", "wan", "circle"];
// let aName = [];
// let season = ["spring", "summer", "fall", "winter"];
// let flower = ["winter_sweet", "archidaceae", "bamboo", "chrysanthemum"];
// let dragon = ["red_zhoung", "facai", "baiban"];
// let wind = ["east_wind", "south_wind", "west_wind", "north_wind"];
// let order = [
//  "one",
//  "two",
//  "three",
//  "four",
//  "five",
//  "six",
//  "seven",
//  "eight",
//  "nine",
// ];
// for (let i = 0; i < 9; i++) {
//  for (let j = 0; j < 4; j++) {
//    if (i < 3) {
//      tiles.push({
//        url: dragon[i],
//        tileType: "dragon",
//        tileSort: "22" + `${i}`,
//        chosen: false,
//        id: id++,
//      });
//    }
//    if (i < 4) {
//      tiles.push({
//        url: wind[i],
//        tileType: "wind",
//        tileSort: "21" + `${i}`,
//        chosen: false,
//        id: id++,
//      });
//    }
//    for (let k = 0; k < 3; k++) {
//      aName[j] = order[i] + "_" + suites_name[k];
//      tiles.push({
//        url: aName[j],
//        tileType: "suite",
//        tileSort: "1" + `${k}` + `${i}`,
//        chosen: false,
//        id: id++,
//      });
//    }
//    if (i == 0) {
//      tiles.push({
//        url: season[j],
//        tileType: "season",
//        tileSort: "33" + `${j}`,
//        chosen: false,
//        id: id++,
//      });
//      tiles.push({
//        url: flower[j],
//        tileType: "flower",
//        tileSort: "32" + `${j}`,
//        chosen: false,
//        id: id++,
//      });
//    }
//  }
// }
// return tiles;
//}

//let tileIndex = [];
// let publicTiles = []
// let sit = ['East', 'South', 'West', 'North']

//let eastWall = [],
//  southWall = [],
//  westWall = [],
//  northWall = [];
//let yourTiles = [eastWall, southWall, westWall, northWall];
//let tilesNotInWall = [];
//let totalTiles = 144;
//let wall = tileMaker();
//let player = { userN: "", location: "", firstPlayer: false, userId: 0 };

// let players = []
//function yourStartTiles() {
//  for (let k = 0; k < 4; k++) {
//    getSeatTiles(k, player.firstPlayer);//if true gets 14 
//  }
//  return yourTiles;
//}

// make new array from two, take off items from one refer to the other
//function publicWall(a) {
//  let publicTiles = [];
//  a.forEach(myFunction);
//  function myFunction(item) {
//    const isNotIn = (everyid) => everyid !== item.id;
//    if (tilesNotInWall.every(isNotIn)) {
//      publicTiles.push(item);
//    }
//  }
//  return shuffleArray(publicTiles);
//}

//build a private hands for players
//function getSeatTiles(seat, firstPlayer) {
//  let x;
//  firstPlayer ? (x = 2) : (x = 1);
//  for (let k = 0; k < x; k++) {
//    tileIndex = getIndex();
//    tilesNotInWall.push(wall[tileIndex].id);
//    yourTiles[seat].push(wall[tileIndex]);
//  }
//  for (let i = 0; i < 12; i++) {
//    tileIndex = getIndex();
//    tilesNotInWall.push(tileIndex);
//    yourTiles[seat].push(wall[tileIndex]);
//  }
//  return yourTiles;
//}

// making tileIndex
//function getIndex() {
//  tileIndex = getRandomizer(0, totalTiles - 1);
//  for (let i = 0; i < tilesNotInWall.length; i++) {
//    if (tilesNotInWall[i] === tileIndex) {
//      getIndex();
//    }
//  }
//  return tileIndex;
//}

//shufflearray
//function shuffleArray(array) {
//  let shuffledArray = Array(array.length);
//  array.forEach(myFunction);
//  function myFunction(item) {
//    let index = myIndex(array.length - 1);
//    const noMoreEmpty = (everyIndex) => shuffledArray[everyIndex] !== "";
//    if (shuffledArray.every(noMoreEmpty)) {
//      while (shuffledArray[index]) {
//        index = myIndex(array.length - 1);
//      }
//      shuffledArray[index] = item;
//    }
//
//    function myIndex(a) {
//      return getRandomizer(0, a);
//    }
//  }
//  return shuffledArray;
//}

//function for get a randome number
//function getRandomizer(bottom, top) {
//  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
//}

//following for grouping and sorting an array (221-264)
function sortGroupingMyTiles(array) {
  let newArray = [];
  let uniqueTile = [...new Set(sortTiles(array))];
  for (let i = 0; i < uniqueTile.length; i++) {
    newArray.push(...groupSuits(array, uniqueTile[i]));
  }
  return newArray.sort(inOrder);
  function inOrder(a, b) {
    return Number(a.tileSort) - Number(b.tileSort);
  }
}

function tileTypes() {
  let a = [];
  let dragon = ["red_zhoung", "facai", "baiban"];
  let season = ["spring", "summer", "fall", "winter"];
  let flower = ["winter_sweet", "archidaceae", "bamboo", "chrysanthemum"];
  let string = ["tiao", "wan", "circle", "wind", dragon, season, flower];
  for (let i = 0; i < 7; i++) {
    if (i > 3) {
      string[i].forEach((str) => a.push(str));
    } else a.push(string[i]);
  }
  return a;
}

// key strings for grouping Tile arrays
function sortTiles(array) {
  let a = tileTypes();
  let newTilesArray = [];
  array.forEach(myFunction);
  function myFunction(item) {
    a.every(function(e) {
      if (item.url.endsWith(e)) {
        newTilesArray.push(e);
      }
      return item;
    });
  }
  return newTilesArray.sort();
}

// grouping tiles by its names
function groupSuits(array, string) {
  let tileType = array.filter(myFunction);
  function myFunction(value) {
    return value.url.endsWith(string);
  }
  return tileType.sort((a, b) => a.tileSort - b.tileSort);
}
//   let arrayJohn = [
//   [{"url":"south_wind","tileType":"wind","chosen":false,"id":29},
//   {"url":"baiban","tileType":"dragon","chosen":false,"id":58},
//   {"url":"nine_tiao","tileType":"suite","chosen":false,"id":132},
//   {"url":"west_wind","tileType":"wind","chosen":false,"id":64},
//   {"url":"nine_circle","tileType":"suite","chosen":false,"id":143},
//   {"url":"nine_circle","tileType":"suite","chosen":false,"id":140},
//   {"url":"six_circle","tileType":"suite","chosen":false,"id":107},
//   {"url":"one_tiao","tileType":"suite","chosen":false,"id":16},
//   {"url":"facai","tileType":"dragon","chosen":false,"id":43},
//   {"url":"west_wind","tileType":"wind","chosen":false,"id":54},
//   {"url":"six_circle","tileType":"suite","chosen":false,"id":98},
//   {"url":"four_wan","tileType":"suite","chosen":false,"id":74},
//   {"url":"south_wind","tileType":"wind","chosen":false,"id":34}
// ],
//   [{"url":"three_wan","tileType":"suite","chosen":false,"id":66},
//   {"url":"north_wind","tileType":"wind","chosen":false,"id":76},
//   {"url":"three_circle","tileType":"suite","chosen":false,"id":57},
//   {"url":"two_tiao","tileType":"suite","chosen":false,"id":35},
//   {"url":"six_circle","tileType":"suite","chosen":false,"id":101},
//   {"url":"nine_wan","tileType":"suite","chosen":false,"id":142},
//   {"url":"nine_wan","tileType":"suite","chosen":false,"id":139},
//   {"url":"five_tiao","tileType":"suite","chosen":false,"id":93},
//   {"url":"east_wind","tileType":"wind","chosen":false,"id":8},
//   {"url":"two_wan","tileType":"suite","chosen":false,"id":46},
//   {"url":"west_wind","tileType":"wind","chosen":false,"id":59},
//   "__vue_devtool_undefined__",
//   {"url":"five_tiao","tileType":"suite","chosen":false,"id":87}
// ],
// [{"url":"three_tiao","tileType":"suite","chosen":false,"id":50},
// {"url":"two_wan","tileType":"suite","chosen":false,"id":31},
// {"url":"two_wan","tileType":"suite","chosen":false,"id":41},
// {"url":"baiban","tileType":"dragon","chosen":false,"id":63},
// {"url":"four_tiao","tileType":"suite","chosen":false,"id":81},
// {"url":"four_wan","tileType":"suite","chosen":false,"id":78},
// {"url":"two_circle","tileType":"suite","chosen":false,"id":47},
// {"url":"nine_wan","tileType":"suite","chosen":false,"id":133},
// {"url":"nine_tiao","tileType":"suite","chosen":false,"id":135},
// {"url":"six_tiao","tileType":"suite","chosen":false,"id":105},
// {"url":"facai","tileType":"dragon","chosen":false,"id":38},
// {"url":"one_tiao","tileType":"suite","chosen":false,"id":23},
// {"url":"nine_tiao","tileType":"suite","chosen":false,"id":138}
// ],
// [{"url":"five_wan","tileType":"suite","chosen":false,"id":85},
// {"url":"nine_circle","tileType":"suite","chosen":false,"id":137},
// {"url":"six_tiao","tileType":"suite","chosen":false,"id":99},
// {"url":"seven_circle","tileType":"suite","chosen":false,"id":110},
// {"url":"two_tiao","tileType":"suite","chosen":false,"id":30},
// {"url":"seven_circle","tileType":"suite","chosen":false,"id":113},
// {"url":"facai","tileType":"dragon","chosen":false,"id":33},
// {"url":"five_circle","tileType":"suite","chosen":false,"id":86},
// {"url":"two_tiao","tileType":"suite","chosen":false,"id":45},
// {"url":"two_wan","tileType":"suite","chosen":false,"id":36},
// {"url":"eight_circle","tileType":"suite","chosen":false,"id":131},
// {"url":"four_circle","tileType":"suite","chosen":false,"id":71},
// {"url":"four_wan","tileType":"suite","chosen":false,"id":70}]]

//checking if '[mahjiang]' could be claimed
// function mahjangArray(array, seat){
//   array[seat].filter(grouping)
//   function grouping (item) {
//     if (item.tileType === 'suite'){tile[suites].push(item)}
//     else if (item.tileType === 'wind'){tile[wind].push(item)}
//     else if (item.tileType === 'dragon'){tile[dragon].push(item)}
//     else if (item.tileType === 'season'){tile[season].push(item)}
//     else if (item.tileType === 'flower'){tile[flower].push(item)}
//     return [...tile[suite], ...tile[wind], ...tile[dragon], ...tile[season], ...tile[flower]]
//   }
//
// }
// window.console.log(mahjangArray(arrayJohn, 0))
