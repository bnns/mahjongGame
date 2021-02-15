//wind_name = [east, south, west, north]
let wind = 21, wt = [1, 2, 3, 4]
//suites_name = ["tiao", "wan", "circle"];
let suite = [1, 2, 3], st = [1, 2, 3, 4, 5, 6, 7, 8, 9]
//dragon = ["red_zhoung", "facai", "baiban"];
let dragon = 22, dt = [1, 2, 3]
let tileSet = [tile1, tile2, tile3, tile4, pair]

//finding pairs, triples, tri-chains, quadros
function tileScaner(array){
  array.sort((a, b) => a.tileSort - b.tileSort);
  let dup = new Array(4);
  let x = 13;
  for (let l = 0; l < 4; l++){
     for (let k = 0; k < x; k++){
        array.forEach((e, i) => {
          if (i !== k){
            if (e.tileSort === array[k].tileSort){
              dup[l].push(e);//dupCounter += dup.length??
              if(dup[l].length===3){
                let arrayTemp = [];
                for (let n=0; n<3; n++){
                     arrayTemp.push(array.slice(dup[l][n], 1))
                }
                l+=1, x-=3 
              }else if (dup[l].length===2){
                let arrayPair = [];
                for (let n=0; n<2; n++){
                     arrayPair.push(array.slice(dup[l][n], 1))
                }
                l+=1, x-=2 
            }
          }
        };
      });
    }
  } alert(arrayPair)
}
let scoring = [{
    Big4Winds: [...211, ...212, ...213, ...214, a, a,]
}
]