// tiles = {suite : [{tiao: 20}, {circle: 21}, {wan: 22}]}
// dragons = [{winds: [{east: 10}, {south: 11}, {west: 12}, {north: 13}]}, {zgfabai: [{baiban: 14}, {zhong: 15}, {faChai: 16} ]}]
// seasons_flowers = [{spting: 30}, {summer: 31}, {fale: 32}, {winter: 33}, {plumBlossom: 34},{orchid: 35},{bamboo: 36},{chrysanthemum: 37}]
// let handTile = [ 
//   { url: 'eight_circle',
//     tileType: 'suite',
//     tileSort: '108',
//     chosen: false,
//     chiPenGan: false,
//     id: 125 },
//   { url: 'eight_tiao',
//     tileType: 'suite',
//     tileSort: '106',
//     chosen: false,
//     chiPenGan: false,
//     id: 126 },
//   { url: 'five_tiao',
//     tileType: 'suite',
//     tileSort: '107',
//     chosen: false,
//     chiPenGan: false,
//     id: 84 },
//   { url: 'five_tiao',
//     tileType: 'suite',
//     tileSort: '210',
//     chosen: false,
//     chiPenGan: false,
//     id: 90 },
//   { url: 'three_tiao',
//     tileType: 'suite',
//     tileSort: '103',
//     chosen: false,
//     chiPenGan: false,
//     id: 65 },
//   { url: 'east_wind',
//     tileType: 'wind',
//     tileSort: '210',
//     chosen: false,
//     chiPenGan: false,
//     id: 1 },
//   { url: 'nine_tiao',
//     tileType: 'suite',
//     tileSort: '107',
//     chosen: false,
//     chiPenGan: false,
//     id: 132 },
//   { url: 'east_wind',
//     tileType: 'wind',
//     tileSort: '210',
//     chosen: false,
//     chiPenGan: false,
//     id: 15 },
//   { url: 'five_tiao',
//     tileType: 'suite',
//     tileSort: '104',
//     chosen: false,
//     chiPenGan: false,
//     id: 87 },
//   { url: 'one_tiao',
//     tileType: 'suite',
//     tileSort: '125',
//     chosen: false,
//     chiPenGan: false,
//     id: 23 }, 
//   { url: 'west_wind',
//     tileType: 'wind',
//     tileSort: '212',
//     chosen: false,
//     chiPenGan: false,
//     id: 59 },
//   { url: 'six_circle',
//     tileType: 'suite',
//     tileSort: '126',
//     chosen: false,
//     chiPenGan: false,
//     id: 107 },
//   { url: 'nine_circle',
//     tileType: 'suite',
//     tileSort: '128',
//     chosen: false,
//     chiPenGan: false,
//     id: 134 },
//   { url: 'four_wan',
//     tileType: 'suite',
//     tileSort: '213',
//     chosen: false,
//     chiPenGan: false,
//     id: 70 } ]
// const e = require("express")
// const {getTiles, randomTiles, tilesMade} = require("./tileMaker")
// let allTiles = getTiles()
// let copiedTiles = [...allTiles].map(e=>[{...e}])
// let players = [{userName: 'john1', dealer: false}, {userName: 'john2', dealer: false}, {userName: 'john3', dealer: true}, {userName: 'john4', dealer: false}]
// let [tilesOnHands, tilesOnTable] = tilesMade(players, randomTiles(allTiles))

//console.log(tileScanner(handTile, '211'))

function tileScanner (tile, t){//tile just got
    tile = tile.sort((a, b)=>(a.tileSort - b.tileSort))
    let x = tile.length, peng = [], chain = [];// found = false;
    if(t){
      pengFinder(tile, t)  //1 find  dup tiles

      for(let k=0; k<4; k++){
        for(let i=1; i<3; i++){
           if(k==0){ //2 find chain go up
              let n = Number(t) + i;
              chainFinder(tile, n, k)
              //if(chain.length===2){k=2}
              if(chain.length===1&&(Number(chain[0]) !== Number(t)+1))
                {chain=[]}
            }
        }
        for(let i=1; i<3; i++){
           if(k==1){ //3 find chain go down
              let n = Number(t) - i;
              chainFinder(tile, n, k)
              if(chain[0]===chain[1]){chain.shift()}//if dup delete first one
              if(i===2&&chain.length===1)[chain=[]]
        }
      }
    }
  }
    function chainFinder (tile, n){
       tile.forEach((e) => {
         if (e.tileSort == JSON.stringify(n))
           {if(chain[chain.length-1]!==e.tileSort) chain.push(e.tileSort)}
       })
       if(chain.length===2){window.console.log(chain.length)}
     // return chain
    }
    function pengFinder (tile, t){
      tile.forEach((e)=>{ 
        if(e.tileSort===t){
          peng.push(e.tileSort)}
       }) 
    }
    // function deDup (dup){
    //   let uniqueEle = [];
    //   dup.forEach((e)=>{console.log(e, 'deDup')
    //       if(!uniqueEle.includes(e)){
    //         uniqueEle.push(e)}
    //       })
    //   dup = uniqueEle    
    // } 
    return [[peng, 'peng'], [chain,'chain']]
 }
    

    // function deDup (dup){
    // let uniqueEle = [];
    // dup.forEach((e)=>{
    //     if(!uniqueEle.includes(e.index)){
    //       uniqueEle.push(e.index)}})

    //       let unique = [...new Set(dup.map(JSON.stringify))];//no same object!!!
    // return unique
    //     }

