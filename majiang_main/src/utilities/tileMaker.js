// const yourStartTiles = (player, wall) => {
  // for (let k = 0; k < 4; k++) {
    // getSeatTiles(k, wall, player[k].dealer);//if true gets 14 
  // }
  // return yourTiles;
// };


let counter = 0;
//making tile walls when starting the game
const yourStartTiles = (players, wall) => {
  if(counter===0){//???
  let tilesOnHand = new Array(4);
  for (let k = 0; k < 4; k++){
    (players[k].dealer)?x=14:x=13;
       tilesOnHand[k] = (wall.slice(0, x),
       wall.splice(0, x));
    }
    counter++//???
    return [tilesOnHand, wall]//four hands made and a wall for dealing
  }
}

const shuffleArray = (array)=>{
  let shuffledArray = Array(array.length);
  array.forEach(myFunction);
  function myFunction(item) {
    let index = myIndex(array.length - 1);
    const noMoreEmpty = (everyIndex) => shuffledArray[everyIndex] !== "";
    if (shuffledArray.every(noMoreEmpty)) {
      while (shuffledArray[index]) {
        index = myIndex(array.length - 1);
      }
      shuffledArray[index] = item;
    }

    function myIndex(a) {
      return getRandomizer(0, a);
    }
  }
  return shuffledArray;
}

//function for get a randome number
function getRandomizer(bottom, top) {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
};

const tileMaker = () => {
    let id = 0;
    let tiles = [];
    // let publicTiles = []
    let suites_name = ["tiao", "wan", "circle"];
    let aName = [];
    let season = ["spring", "summer", "fall", "winter"];
    let flower = ["winter_sweet", "archidaceae", "bamboo", "chrysanthemum"]
    let dragon = ["red_zhoung", "facai", "baiban"];
    let wind = ["east_wind", "south_wind", "west_wind", "north_wind"];
    let order = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3) {
          tiles.push({
            url: dragon[i],
            tileType: "dragon",
            tileSort: "22" + `${i}`,
            chosen: false,
            chiPenGan: false,
            id: id++,
          });
        }
        if (i < 4) {
          tiles.push({
            url: wind[i],
            tileType: "wind",
            tileSort: "21" + `${i}`,
            chosen: false,
            chiPenGan: false,
            id: id++,
          });
        }
        for (let k = 0; k < 3; k++) {
          aName[j] = order[i] + "_" + suites_name[k];
          tiles.push({
            url: aName[j],
            tileType: "suite",
            tileSort: "1" + `${k}` + `${i}`,
            chosen: false,
            chiPenGan: false,
            id: id++,
          });
        }
        if (i == 0) {
          tiles.push({
            url: season[j],
            tileType: "season",
            tileSort: "33" + `${j}`,
            chosen: false,
            chiPenGan: false,
            id: id++,
          });
          tiles.push({
            url: flower[j],
            tileType: "flower",
            tileSort: "32" + `${j}`,
            chosen: false,
            chiPenGan: false,
            id: id++,
          });
        }
      }
    }
    return tiles;
  };

  //build a private hands for players
function getSeatTiles(seat, wall, firstPlayer) {
  let x;
  let tilesNotInWall =[];
  firstPlayer ? (x = 2) : (x = 1);
  for (let k = 0; k < x; k++) {
    tileIndex = getIndex(wall);
    tilesNotInWall.push(wall[tileIndex].id);
    yourTiles[seat].push(wall[tileIndex]);
  }
  for (let i = 0; i < 12; i++) {
    tileIndex = getIndex(wall);
    tilesNotInWall.push(tileIndex);
    yourTiles[seat].push(wall[tileIndex]);
  }
  return [yourTiles, tilesNotInWall];
};

// making tileIndex
function getIndex(array) {
  tileIndex = getRandomizer(0, array.length - 1);
  for (let i = 0; i < array.length; i++) {
    if (array[i] === tileIndex) {
      getIndex(array);
    }
  }
  return tileIndex;
};
// module.exports = {
  // tileMaker: tileMaker(),
  // shuffleArray: shuffleArray(),
  // yourStartTiles: yourStartTiles(),
// };
  exports.getTiles = tileMaker;
  exports.randomTiles = shuffleArray;
  exports.tilesMade = yourStartTiles;
  // const _tileMaker = tileMaker;
  // export { _tileMaker as tileMaker };  