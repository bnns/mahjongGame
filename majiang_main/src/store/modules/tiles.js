
const state = {
  players: [],
  dicedNumber: [
    [5,5,5,5],
    [5,5,5,5],
    [5,5,5,5],
    [5,5,5,5]
  ],
  tilesAll:[], //full set of mahjiang tiles
  tilesOnHands:[], //four private of tiles randomly made of tilesAll
  discardedTiles: [[], [], [], []], //distiled from each players
  publicTiles: [], //tiles yet to deal||left over of tilesAll
  takeFromFront:0,
};
console.log(state.tilesOnHands)
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
  setluckyNumber({commit}, arg){
    commit("myNumber", arg);
  },
  updMyTiles({commit}, arg){//1. relocat, 2. discasting,  3. casting
    commit('tilesUpdt', arg);
  },
  consisTiles({commit}, arg){
    if(arg[0]==='sorted'){
      commit("consisTileOnHands", [arg[1],arg[2]])
    }
    else{
    commit('setPublicTiles', arg[2])
    commit('consisTileOnHands', [arg[0],arg[1]])
    commit('consisTilesDiscard', [arg[0],arg[3]])
  }
}, //good
  updTakeFromFront({commit}){
    commit('fromFront')
  }
};

const mutations={
  allTiles:(state, arg)=>(state.tilesAll = arg), //all washed tiles to start
  setTiles:(state, arg)=>(state.tilesOnHands = arg),//yourStartTiles()), //in hands of 4 players
  consisTileOnHands:(state, arg)=>(state.tilesOnHands[arg[0]]=arg[1]),
  consisTilesDiscard:(state, arg)=>(state.discardedTiles=arg[1]),
  setPublicTiles:(state, arg)=>(state.publicTiles=arg),// publicWall(state.tilesAll)), //left on table center
  players: (state, arg)=>(state.players=arg),
  tileChosen: (state, arg)=>
    state.tilesOnHands[arg[0]].filter(function(e){
      if(e.id===arg[1]){
        e.chosen = !e.chosen;//true or false?
      }
    }), 
  fromFront:(state)=>
    state.takeFromFront++,
  tilesUpdt: (state, arg)=>{
    if(arg[0]==="relocate"){//tile from [2] to [1], --relocating
      let a, b=Number(arg[5]), c
      state.tilesOnHands[arg[1]].forEach((ele,i)=>(
      (ele.id===b)?(a=i, c=ele):window.console.log("doNothing")))
      state.tilesOnHands[arg[1]].splice(a,1)
      state.tilesOnHands[arg[1]].splice(arg[2],0,c)
    window.console.log(state.tilesOnHands[arg[1]])
    }
    else if (arg[0]==="deserted"){
    let a, b=Number(arg[2]),c
    state.tilesOnHands[arg[1]].map((ele, i)=>(
    (ele.id===b)?(a=i, c=ele):"doNothing"))
      state.tilesOnHands[arg[1]].splice(a, 1)
       state.discardedTiles[arg[1]].push(c)
      if(state.tilesOnHands[arg[1]].length===12)
      {let c=state.publicTiles.shift()
      state.tilesOnHands[arg[1]].push(c)}
    }
    else if(arg[0]==="inserted"){
        if(state.tilesOnHands[arg[1]].length===13)//tilesCount???
        {let a=state.publicTiles.shift()
        state.tilesOnHands[arg[1]].push(a)}
    }
    else if(arg[0]==="sorting"){
      sortGrouping(state, arg[1])
    }
    else if(arg[0]==="peng"||arg[0]==="chow"||arg[0]==="kong"){//[1]=index,[2]=tileId,[3]=self
      window.console.log(arg)
      let index
      let array=state.discardedTiles[arg[1]]
      state.discardedTiles[arg[1]]
      .forEach((e, i)=>{e.id==arg[2]
      ?(index=i, (e.chosen=true, e.chiPenGan=(arg[0]==="chow")
      ?1:(arg[0]==='peng')
      ?2:(arg[0]==='kong')
      ?3:""))
      :'', console.log(e.id===arg[2], e.tileSort)})
      
      console.log(array[index])
      state.tilesOnHands[arg[3]].push(array[index])
      state.discardedTiles[arg[1]].splice(index,1)
  // console.log(array[index], ' / e.id', array[index].id)

      // array.forEach(e=>e.id===arg[2]
      // ?(a[0].chosen=true, a[0].chiPenGan=(arg[0]==="chow")
      // ?1:(arg[0]==='peng')
      // ?2:(arg[0]==='kong')
      // ?3:"")
      // :'')
      // state.discardedTiles[arg[1]].splice(index,1)
      // console.log(state.tilesOnHands[arg[3]], '//arg[3]//', a[0])
  //  state.tilesOnHands[arg[3]].push(array[index])
      }
    // state.tilesOnHands[arg[3]].forEach(e=>{
    //   if(a[0].tileSort===e.tileSort){e.chiPenGan=(arg[0]==="chow")
    //   ?1:(arg[0]==='peng')?2:(arg[0]==='kong')?3:""}
    // })

    // else if(arg[0]==="chow"){
    //   window.console.log(arg)
    // }
    // else if(arg[0]==="kong"){
    //   window.console.log(arg)
    // }
  },
  myNumber: (state, arg)=>{
    state.dicedNumber.splice(arg[0], 1, arg[1]); 
  }, //diced numbers from each
};
// discardedTiles: state=>state.discardedTiles=tileMaker(),
const getters = {
  getTiles:(state)=>(index)=>{
    if(typeof(index)==='number'){
    return state.tilesOnHands[index]}
   else{return state.tilesOnHands}
  },
  // retrive datas: state => state.tilesAll,
  getDisCardedTiles:(state)=>(index)=>{
    if(typeof(index)==='number')
    {return state.discardedTiles[index]}
  else{return state.discardedTiles}},
  getPublicTiles:(state)=>(index)=>{//????
   if(state.tilesOnHands[index].length<14){//tilesCount
      state.tilesOnHands[index].push(state.publicTiles.pop());
    }
  },
  getTableTiles:(state)=>state.publicTiles,
  getDicedNumber:(state)=>state.dicedNumber,
  getPlayers:(state)=>state.players,
  getFromFront:(state)=>state.takeFromFront,
};
export default {
  state,
  getters,
  actions,
  mutations,
};
function sortGrouping(state, arg){
  let copy=state.tilesOnHands[arg].slice();
  copy= sortGroupingMyTiles(copy);
  state.tilesOnHands.splice(arg, 1,  copy);
} //sorted tiles onhands

function sortGroupingMyTiles(array) {
  let newArray = [];
  let uniqueTile = [...new Set(sortTiles(array))];
  for (let i = 0; i < uniqueTile.length; i++) {
    newArray.push(...groupSuits(array, uniqueTile[i]));
  }
  return newArray.sort(inOrder);
  function inOrder(a, b){
    return Number(a.tileSort)-Number(b.tileSort);
  }
}

function tileTypes(){
  let a=[];
  let dragon=["red_zhoung", "facai", "baiban"];
  let season=["spring", "summer", "fall", "winter"];
  let flower=["winter_sweet", "archidaceae", "bamboo", "chrysanthemum"];
  let string=["tiao", "wan", "circle", "wind", dragon, season, flower];
  for(let i=0; i<7; i++){
    if(i>3){
      string[i].forEach(str=>a.push(str));
    } else a.push(string[i]);
  }
  return a;
}

// key strings for grouping Tile arrays
function sortTiles(array) {
  let a=tileTypes();
  let newTilesArray=[];
  array.forEach(myFunction);
  function myFunction(item) {
    a.every(function(e){
      if(item.url.endsWith(e)){
        newTilesArray.push(e);
      }
      return item;
    });
  }
  return newTilesArray.sort();
}

// grouping tiles by its names
function groupSuits(array, string){
  let tileType=array.filter(myFunction);
  function myFunction(value){
    return value.url.endsWith(string);
  }
  return tileType.sort((a, b)=>a.tileSort-b.tileSort);
}