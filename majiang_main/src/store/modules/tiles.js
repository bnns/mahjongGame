
const state = {
  players: [],
  dicedNumber: [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ],
  tilesAll: [], //full set of mahjiang tiles
  tilesOnHands: [], //four private of tiles randomly made of full set
  discardedTiles: [[], [], [], []], //distiled from each players

  publicTiles: [], //tiles yet to deal
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
  updDiscardedTile({ commit }, arg) {
    commit("tileDiscarded", arg);
  },
  updPublicTiles1({ commit }, arg) {
    commit("outGivingPubTile1", arg);//arg[0]-false or true, arg[1]=[this.self]
  },
  setluckyNumber({ commit }, arg) {
    commit("myNumber", arg);
  },
  updMyTiles({commit}, arg){
    commit('tilesUpdt', arg);
    commit('outGivingPubTile', arg[0]);//???? 
  },
  updTiles({ commit }, arg) {//sort only
    commit("sortGrouping", arg)
  },
  // updPublicTiles2({commit}, arg){
  //   commit('outGivingPubTile2', arg)
  // },
};

const mutations = {
  allTiles: (state, arg) => (state.tilesAll = arg), //all washed tiles to start
  setTiles: (state, arg) => (state.tilesOnHands = arg),//yourStartTiles()), //in hands of 4 players
  setPublicTiles: (state, arg) => (state.publicTiles = arg),// publicWall(state.tilesAll)), //left on table center
  players: (state, arg) => (state.players = arg),
  tileChosen: (state, arg) =>
    state.tilesOnHands[arg[0]].filter(function(e) {
      if (e.id === arg[1]) {
        e.chosen = !e.chosen;//true or false?
      }
    }), //chosen to do something
  tileDiscarded: (state, arg) => state.discardedTiles[arg[1]].push(arg[0]), //used

  outGivingPubTile1: (state, arg) => {
    // if (arg[0]&&state.tilesOnHands[arg[1]].length < 14) {//arg[0]=boolean
    //   let a = state.publicTiles.shift();//????
    //   state.tilesOnHands[arg[1]].push(a)
    // } else 
    if(!arg[0]){
      let a = state.publicTiles.shift();
      state.tilesOnHands[arg[1]].push(a)
    }
  }, //tiles for each player

  tilesUpdt: (state, arg) => {
    if(arg.length===4){//tile from [2] to [1]
    state.tilesOnHands[arg[0]].splice(arg[2],1)
    state.tilesOnHands[arg[0]].splice(arg[1],0,arg[3])
    } else if (arg.length===3){//distile [1]
      state.tilesOnHands[arg[0]].splice(arg[1], 1)
      state.discardedTiles[arg[0]].push(arg[2])//add it to discarded
    }
    else if (arg.length===1){
      if (state.tilesOnHands[arg].length < 13)
        {let a = state.publicTiles.shift();
          state.tilesOnHands[arg].push(a)}
    }
  },

  myNumber: (state, arg) => {
    state.dicedNumber.splice(arg[0], 1, arg[1]); //have error here?
    //emit to server
    //socket.emit("diceNumber", state.dicedNumber);
  }, //diced numbers from each
  
  sortGrouping: (state, arg) => {
    let copy = state.tilesOnHands[arg].slice();
    copy = sortGroupingMyTiles(copy);
    state.tilesOnHands.splice(arg, 1,  copy);
  }, //sorted tiles onhands

  // outGivingPubTile2: (state, arg)=>state.tiles[arg].push(state.publicTiles.pop()),
};

// discardedTiles: state=>state.discardedTiles=tileMaker(),
const getters = {
  getTiles: (state) => (index) => {
    state.tilesOnHands[index];
    return state.tilesOnHands[index];
  },
  // getAllTiles: state => state.tilesAll,
  getdiscardedTiles: (state) => (index) => state.discardedTiles[index],
  getDicedNumber: (state) => state.dicedNumber,
  getPublicTiles: (state) => (index) => {//????
    if (state.tilesOnHands[index].length < 14) {
      state.tilesOnHands[index].push(state.publicTiles.pop());
    }
  },
  getTableTiles: (state) => state.publicTiles,
  getPlayers: (state) => state.players,
};
export default {
  state,
  getters,
  actions,
  mutations,
};

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