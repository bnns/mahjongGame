export function seeIfHula(arg) {
  let tiles=arg.slice()
  console.log(tiles)
    let data=arg.sort((a, b)=>{a.tileSort-b.tileSort})
let result1=findPong(data)
let leftOver1=Object.values(result1).slice()
  console.log(leftOver1, ' / ', 'grouping')
 if(leftOver1.length===5&&leftOver1.flat().length===14){
   let tile1=leftOver1.flat();
             console.log('FOUR PONGS')
              this.mahjiongB=true
              this.hulaNow(tile1)
              return
 }else if(leftOver1.length===7&&leftOver1.flat().length===14)
    {let tile1=leftOver1.flat(); let a = findPair(tile1)
     if(a[0].length===7){
             console.log('SEVEN PAIRS')
              this.mahjiongB=true
              this.hulaNow(tile1)
              return
     }}

     let chow = findChowHand(data)
     let chow1=chow.sort((a, b)=>a.length-b.length)
     console.log(chow1, '/ data at line 328')
     if(chow1.length===5){
        this.mahjiongB=true
        this.hulaNow(chow1)
        return
  } 

//=============================================================
let result=findPair(arg)
  let leftOver=result.slice()//good
  console.log(leftOver, ' / ',' of findPairs')
  if(leftOver[0].flat().length>1){

for(let i=0; i<leftOver[0].length; i++){
let a=leftOver[0].slice(), b=leftOver[1].slice()
let pairAndRest=[]
pairAndRest=[a, b, i]

console.log(pairAndRest, ' / ', i)

let result=this.pairJustify(pairAndRest)

result[1].sort((a, b)=>a.tileSort-b.tileSort)//array.length=12

let arg=result[1].slice()
   let pong=Object.values(findPong(arg)).sort((a, b)=>
   b.length-a.length)

   let pongs=[],rest=[]
   pong.forEach(e=>e.length>2?pongs.push(e):rest.push(e))
   if(pongs.length===4&&rest.length===0){
    i=7;  let tile=result[0].concat(pongs).flat()
             console.log(pong, " / this is pong's result")
        this.mahjiongB=true
        this.hulaNow(tile)
   } else if(pongs.length>0){
     let pong1=pongs.slice()
     for(let k=0; k<pong1.length; k++){
         let pong2=pong1.splice(pong1.length-k, k)
         let rest2=rest.concat(pong2).flat()
         console.log(pong2, ' / pong2', rest2, ' /rest2')
         let chow=findChowHand(rest2)
         if(chow.length===4-pong1.length)
         i=7; let tile=(result[0].concat(chow.concat(pong1)).flat(2))
         this.mahjiongB=true
         this.hulaNow(tile)
     }
   } else if(pongs.length===0){
    let chow = findChowHand(arg)
 if(chow.length===4){
   i=7; let tile=result[0].concat(chow).flat()
             console.log(chow, " / this is chow's result")
          this.mahjiongB=true
          this.hulaNow(tile)
 }
}
console.log("no mahjong to call!")
}
}
      if (this.mahjiongB) {
        (this.chowChain = this.myTiles),
          (this.show = true),
          (this.msg = "Hula");
        return this.mahjiongB;
      } else {
        return (this.mahjiongB = false);
      }
}
//=======================================================
export function findPong(data) {
  let groupBy = function(data, key) {
    return data.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  let c = groupBy(data, "tileSort");
  return c;
}

//========================================================
export function findChowHand(arg) {
  let data=arg.slice().flat()
  data.sort((a, b)=>a.tileSort-b.tileSort)
  let chowGroup = [];
  let counter = 20;
  function findChow(data) {
    let chow = [];
    let rest = [];
    data.forEach((ele) => {
      //console.log(ele.tileSort);
      chow.length === 0
        ? chow.push(ele)
        : chow[chow.length - 1].tileSort === ele.tileSort - 1 &&
          chow.length !== 3
        ? chow.push(ele)
        : rest.push(ele);
      //    window.console.log(rest,"/",idx)
    });
    chowGroup.push(chow);
    counter--;
    counter || !chow
      ? findChow(rest)
      : // (counter)?findChow(rest)
      rest.length
      ? rest.push(rest)
      : "end!";
    rest = [];
    chow = [];
  }
  if (chowGroup.length === 0) {
    findChow(data);
  }
  let temp = [];
  let a= peelZeros(chowGroup);
  a.sort((a,b)=>b.length-a.length)
  if(a.length>4){grouping(a)}
  return a
 

  function peelZeros(data) {
    data.forEach((e) =>
      e.length !== 0
        ? temp.push(e) //??????
        : "doNothing"
    );
   // window.console.log(Object.values(temp), ' / ', counter)
    return temp;
  }
}
//=====================================================
export function grouping(array) {
  let groupOne = [],
    groupTwo = [];
  array.forEach((e) => {
    if (e.length === 0) {
      return;
    }
    if (e.length > 1) {
      groupOne.push(e);
    } else {
      Array.prototype.push.apply(groupTwo, e);
    }
  });
  let a = Object.values(findPong(groupTwo));

  let result = groupOne.concat(a);

  return result;
}
export function findPair(arg){
  let data=arg.slice(), holder=[]
   let temp1=findPong(data)
   let temp=Object.values(temp1)
   // console.log(temp.flat())
   let copy= temp.slice()
   let a = copy
  // console.log(temp, '// value of findPong')
   if(a.length===7){if(a.every(e=>e.length===2)){ return [a, temp=[]]}}
  
   a.forEach((e)=>(e.length>2)
   ?holder.push(e.splice(1, 3))
   :(e.length===2)
   ?(holder.push(e.splice(0,2))) :'')

   a.forEach((e, i, array)=>e.length===2
   ?array.splice(i, 2)
   :e.length===0
   ?array.splice(i,1)
   :'')
   a.forEach((e, i, array)=>
   e.length===0
   ?array.splice(i,1)
   :'')
 // console.log([holder, a])
  return [holder, a]
}
// export function findPair(arg){
//   let data=arg.slice(), holder=[]
//    let temp1=findPong(data)
//    let temp=Object.values(temp1)
//    // console.log(temp.flat())
//    let copy= temp.slice()
//    let a = copy.flat().slice()
//    console.log(a, '// value of findPong')
//    if(a.length===7){if(a.every(e=>e.length===2)){ return [a, temp=[]]}}
//    a.forEach((e)=>(e.length>2)
//    ?holder.push(e.splice(1, 3))
//   // ?(a.splice(i+1), rest.push(holder.splice(1)))holder.push(e.pop()
//    :(e.length===2)
//    ?(holder.push(e.splice(0,2))) :'')//??????????????
//    a.forEach((e, i, array)=>e.length===2?array.splice(0, 2):'')//????????
//   console.log([holder, a])
//   return [holder, a]
// }
//====================================================
export function pairJustify(pairAndRest) {
  console.log(pairAndRest)
let i = pairAndRest[2],
    a = pairAndRest[1].slice(),
    b = pairAndRest[0][i],
    tempPair = b.slice(),
    temp = pairAndRest[0].filter(e=>e[0].tileSort!==b[0].tileSort)
    a.push(temp)
  //Object.values(temp).forEach(e=>e.forEach(ele=>pairAndRest[1].push(ele)))
  let data = [tempPair, a.flat(2)];
  console.log(data)
  return data;
}
// export function pairJustify(pairAndRest) {
//   let i = pairAndRest[2],
//       b = pairAndRest[0][i],
//       tempPair = b.slice(),
//       temp = pairAndRest[0].filter(e=>e[0].tileSort!==b[0].tileSort)
//    // window.console.log(Object.values(temp)[0][1])
//     Object.values(temp).forEach(e=>e.forEach(ele=>pairAndRest[1].push(ele)))
//     let data = [tempPair, pairAndRest[1]];
//     return data;
//   }
//====================================================
// export function findPair(data) {
//   data.sort((a, b) => a.tileSort - b.tileSort);
//   let pairGroup = [],
//     pair = [],
//     temp = data.slice();
//   let counter = 14
//   function pairScanner(arg) {
//     let data=arg.slice()
//     counter--;
   
//     if (counter === 0 ) {
//       window.console.log(pairGroup, "/", counter, "/", temp);
//       return;
//     }
//     data.forEach((e) => {
//       if (pair.length === 1 && e.tileSort === pair[0].tileSort) {
//         pair.push(e);
//       }
//       if (pair.length === 2) {
//         pairGroup.push(pair.slice());
//         temp = data;
//         for (let i = 0; i < 2; i++) {
//           let tempPair = pair[0];
//           temp.forEach((e, i) => {
//             e === tempPair ? (pair.splice(0, 1), data.splice(i, 1)) : "";
//           });
//           temp = data;
//         }
//       } else {
//         pair = [];
//       }
//       if (pair.length === 0) {
//         pair.push(e);
//         return;
//       }
//     });
//   }

//   if (counter>2) {
//     window.console.log(pairGroup, "/", counter, "/", temp), pairScanner(temp);
//   }

//   return [pairGroup, temp];
// }

