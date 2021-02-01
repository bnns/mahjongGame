import Vue from 'vue'
import Vuex from 'vuex'
import tiles from './modules/tiles'

Vue.use(Vuex)

//create store
export default new Vuex.Store({
  modules: {
    tiles,
    }
})

// function to generate collection of tiles
// function tileMaker (){
//   let tiles = []
//   let suites_name = ['tiao', 'wan', 'circle']
//   let aName=[]
//   let season=['spring', 'summer', 'fall', 'winter']
//   let flower=['winter_sweet', 'archidaceae', 'bamboo', 'chrysanthemum']
//   let dragon=['red_zhoung', 'facai', 'baiban']
//   let wind=['east', 'south', 'west', 'north']
//   let order=['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
//    for(let i = 0; i < 9; i++){
//       for(let j =0; j < 4; j++){
//         if (i<3){tiles.push(dragon[i])}
//         if(i<4){tiles.push(wind[i])}
//         for(let k=0; k<3; k++){
//          aName[j] = order[i]+"_"+suites_name[k]
//          tiles.push(aName[j])
//        }
//          if(i==0){
//          tiles.push(season[j])
//          tiles.push(flower[j])
//        }
//       }
//  }
//    return tiles
// }
//
// let tileIndex = []
// let sit = ['East', 'South', 'West', 'North']
//
//
// let eastWall=[], southWall=[],westWall=[],northWall=[]
// let yourTiles =[eastWall, southWall, westWall, northWall]
// let tilesNotInWall = []
// let totalTiles = 144
// let wall = tileMaker()

// yourStartTiles()
// console.log(yourTiles[2]+ "---you sit"+ sit[2])
// console.log(yourTiles[0]+ "---you ait"+ sit[0])
// console.log(yourTiles[1]+ "---you ait"+ sit[1])
// console.log(yourTiles[3]+ "---you ait"+ sit[3])
// let player = {userN:"", location:'', firstPlayer:false, userId:0}
// let players = []

// export function yourStartTiles(){
//  for (let k = 0; k < 4; k++){
//   getSeatTiles(k, player.firstPlayer)
// } return yourTiles
// }

//build a private hands for players
// function getSeatTiles(seat, firstPlayer){
//   let x
//   (firstPlayer) ? x =2 : x = 1
//   for (let k=0; k < x; k++){
//   tileIndex = getIndex()
//   tilesNotInWall.push(tileIndex)
//   yourTiles[seat].push(wall[tileIndex])
// }
//      for (let i = 0; i < 12; i++){
//        tileIndex=getIndex()
//        tilesNotInWall.push(tileIndex)
//   yourTiles[seat].push(wall[tileIndex])
// }
//   return(yourTiles[seat]+ "---"+ sit[seat])
// }

// making tileIndex
// function getIndex () {
//   tileIndex = getRandomizer(1, totalTiles)
//   for (let i = 0; i < tilesNotInWall.length; i++){
//   if (tilesNotInWall[i]===tileIndex) {getIndex()}
// } return tileIndex
// }

//function for get a randome number
// function getRandomizer(bottom, top) {
//         return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
//     }
