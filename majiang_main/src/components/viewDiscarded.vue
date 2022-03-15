<template>
  <div class="container" refs="container">
    <div  :class="{blink:(chowAllowed||pengAllowed)&&blink}"
    class="lastCasted"
    @click="chiPonKon()">
        <img
          :src="require(`../assets/${lastCasted[0].url}.png`)"
          :alt="`${lastCasted[0].url}`"
          v-show="!castedShow"
        />
    </div>
    <div
      class="pengChowKong center"
      v-if="`${peng || chow || kong || mahjiongB}` && show"
    >
      <input type="checkbox" @change="this.checkYes" />
      {{ msg + " ?" }}
      <input ref="checkbox" type="checkbox" @change="this.checkNo" />
    </div>

    <div class="section center" v-if="chowOption">
           <section
             :class="{ selectHide: chowOption }"
             v-for="(chowItem, index) of chowChain"
             :key="index"
             multiple="multiple"
           >
               <img
                 :src="require(`../assets/${chowItem.url}.png`)"
                 :alt="`${chowItem.url}`"
                 @click="chowSelected(index)"
               />
          </section>
      <!-- <button class="btn" type="submit" @click="handleData(chowItem)"
      >X</button> -->
    </div>
    <div class="_self">
      <a class="tile-back-tail" @click="$emit('getTile', self)">
        <img src="../assets/back_m.png" alt="image lost" />
        <h4 class="tail">{{ tilesOnTableLength }}</h4>
      </a>
      <div class="self-b" v-show="castedShow">
        <img
          v-for="(tile, index) in discardedTiles[self]
          .slice(0)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt='tile.url'
          v-on:click="tileClicked(self, tile.tileSort, tile.id)"
        />
      </div>
      <button
        class="nameS color"
        :class="goAhead[self] && myTurn"
        @click="hula('Hula', myTiles)"
      >
        <!-- peng, chow, pair for hula -->
        {{ users ? users[self].name : "Here" }}
      </button>
      <div class="seat">{{ users[self].mySeat }}</div>
    </div>
    <!-- sort tiles -->

    <div class="_right">
      <div class="right-b" v-show="castedShow">
        <img
          v-for="(tile, index) in discardedTiles[right]
          .slice(-5)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt="`${tile.url}`"
          @click="tileClicked(right, tile.tileSort, tile.id)"
        />
      </div>
      <h3 class="nameR color" :class="goAhead[right] && myTurn">
        {{ users[right].name }}
      </h3>
      <div class="seat">{{ users[right].mySeat }}</div>
    </div>
    <div class="_cross">
      <div class="cross-b" v-show="castedShow">
        <img
          v-for="(tile, index) in discardedTiles[cross]
          .slice(-5)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt="`${tile.url}`"
          v-on:click="tileClicked(cross, tile.tileSort, tile.id)"
        />
      </div>
      <h3 class="nameC color" :class="goAhead[cross] && myTurn">
        {{ users[cross].name }}
      </h3>
      <div class="seat">{{ users[cross].mySeat }}</div>
    </div>
    <div class="_left">
      <a class="tile-back-front" @click="$emit('getTile', self)">
        <img src="../assets/back_m.png" alt="image lost" />
        <h4 class="front">{{ frontTileBack }}</h4>
      </a>
      <div class="left-b" v-show="castedShow">
        <img
          v-for="(tile, index) in discardedTiles[left]
          .slice(-5)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt="`${tile.url}`"
          v-on:click="tileClicked(left, tile.tileSort, tile.id)"
        />
      </div>
      <h3 class="nameL color" :class="goAhead[left] && myTurn">
        {{ users[left].name }}
      </h3>
      <div class="seat">{{ users[left].mySeat }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import { findChowHand, findPong, findPair } from "../utilities/hula";

export default {
  name: "ViewDiscarded",
  props: [
    "lastCasted",
    "mahjiong",
    "myTiles",
    "self",
    "right",
    "cross",
    "left",
    "users",
    "goAhead",
    "chowAllowed",
    "pengAllowed",
    "tilesCount",
    "discardedTiles",
    "tilesOnTableLength",
    "frontTileBack",
  ],
  data() {
    return {
      payload: null,
      chowChain: [],
      go: false,
      show: false,
      chowOption: false,
      msg: "",
      castedShow:false,
      blink:false,
      peng: false,
      chow: false,
      kong: false,
      mahjiongB: false,
      myTurn: "inturn",
    };
  },
  
  computed: {
    ...mapGetters([
      "getTiles",
      // 'getDisCardedTiles'
    ]),
  },
  watch: {
    users: {
      handler(val) {
        return val;
      },
      deep: true,
    },
     lastCasted: {
      handler(val) {
        (this.blink)?this.blink=false:false
        return val;
      },
       deep:true,
    },
   chowAllowed:{
       handler(val) {
         if(val){this.blink=true}
        return val;
      },
    },
    pengAllowed:{
      handler(val) {
         if(val){this.blink=true}
        return val;
      },
    },
    myTiles: {
      handler(val) {
        return val;
      },
    },
    discardedTiles: {
      handler(val) {
        return val;
      },
      deep: true,
    },
   
    mahjiong: {
      handler(val) {
       alert("Hula");
        if (val) {
          (this.show = true),
            (this.chowChain = val),
            (this.mahjiongB = true),
            (this.chowOption = true);
        }
        return
      },
    },
  },
  methods: {
    // action(a){this.getPublicTiles(a)},
    tileClicked(areaIdx, tileSort, tileId) {
      console.log(this.chowChain, 'chowChain/', tileId)
      //b:area.index, c:tileSort, d:tileId
      //  window.console.log(areaIdx,' / ',tileSort,' / ',tileId, '/',this.self)
      // this.mahjiongB = this.hula("checkHula", areaIdx, tileSort, tileId);
      // if(this.mahjionB){this.hulaNow()}
      if (tileSort !== this.lastCasted[0].tileSort) {
        alert("not last one!");
        return;
      }

      if (!this.mahjiongB) {
        let peng = [tileSort],
            chow = [tileSort];
        this.getTiles(this.self).forEach((ele) => {
          let a = this.self - 1 < 0 ? 3 : this.self - 1;
          if (areaIdx !== this.self) {
            ele.tileSort === peng[0] ? peng.push(peng[0]) : "";
          }
          if (areaIdx === a && tileSort < 210) {
            let counter = 0;
            ele.tileSort === chow[0] - 1 //??????????????????????
              ? (chow = this.backward(chow, this.getTiles(this.self)))
              : ele.tileSort === chow[chow.length - 1] + 1 && counter < 2 //2 times at most
              ? (chow.push(ele.tileSort), counter++)
              : "";
//console.log(peng, 'peng/', chow, 'chow/')
          }
        });
        //===========================
        window.console.log(
          peng,
          peng.length > 2,
          peng,
          peng.length > 3,
          chow,
          chow.length > 2
        ); //========================
        this.peng = peng.length > 2;
        this.kong = peng.length > 3;
        this.chow = chow.length > 2;

        if (this.chow) {
          if (chow.length > 3) {
            chow.forEach((e) => {
              e.tileSort < (tileSort + 2) && e.tileSort >( tileSort - 2)
                ? this.chowChain.push(e)
                : "";
            });
          }
          this.chowChain = chow.slice();//??????????????????
          console.log(this.chowChain, ' / chowChain')
        }
      
        let result;
        if (tileId === null) {
          result = this.concealed();
          if (result[0]) {
            (this.kong = true), window.console.log(result[1]);
          }
        }
      }//if(!this.majiang)
      if(!this.kong&&!this.chow&&!this.peng){
       this.mahjiongB = this.hula("checkHula", areaIdx, tileSort, tileId)}
     // if(this.mahjionB){this.hulaNow()}

      if (this.mahjiongB || this.kong || this.peng || this.chow) {
        //if three trues? two trues??
        this.show = true;
        this.msg = this.mahjiongB
          ? "Hula"
          : this.peng
          ? "Peng"
          : this.chow
          ? "Chow"
          : this.kong
          ? "Kong"
          : "";
        this.payload = [
          this.mahjiongB,
          this.peng,
          this.chow,
          this.kong,
          areaIdx,
          tileId,
          this.self,
        ];
      }
    },

    checkYes: function() {
      this.show = false;
      if (this.msg === "Peng") {
        (this.chow = this.kong = this.mahjiongB = false);
      }
      if (this.msg === "Kong") {
        (this.chow = false), (this.peng = false), (this.mahjiongB = false);
        this.$emit('updTilesCount')
      }
      if (this.msg === "Chow") {
        (this.peng = false), (this.kong = false), (this.mahjiongB = false);
      }
      if (this.msg === "Hula") {
        (this.chow = false), (this.kong = false), (this.peng = false);
      }
      if(this.chowChain.length>2){
        console.log(this.chowChain)
        this.chowChain.find((e, i, array)=>e===this.lastCasted[0].tileSort
        ?array.splice(i, 1):'')
        
      }
      if(this.chowChain.length===2){
         let copy=this.chowChain.slice()
        this.myTiles.find((e)=>
        copy.forEach((ele, i, array)=>ele===e.tileSort
        ?(e.chiPenGan=1, array.splice(i, 1))
        :''))
      }
      this.go = true;
      console.log(this.mahjiongB, "/mahjiangB");
      let tempTile
      if (this.mahjiongB) {
      if(this.myTiles.length<this.tilesCount[this.self])//tilesCount[this.self]
      {
        tempTile=[...this.lastCasted[0], this.myTiles]
      }else{tempTile=this.myTiles}
        this.$emit("hula", tempTile);//???????????????????????
      }
      if (this.go) {
        window.console.log(this.payload);
        this.$emit("pengChowKong", this.payload);
        this.payload=[]
        if (this.chow) {
          let array = this.myTiles;
          let chow = this.chowChain.slice();
          this.chowChain = [];
          chow = chow.filter(
            (e) =>
              e !== this.lastCasted[0].tileSort &&
              e < this.lastCasted[0].tileSort + 3 &&
              e > this.lastCasted[0].tileSort - 3
          );
          if (chow.length > 2) {
            for (let i = 0; i < chow.length; i++) {
              this.chowChain[i] = array.find((e) => e.tileSort === chow[i]);
            }
            window.console.log(this.chowChain, " / ", this.chowChain);
            this.chowOption = true;
          }
        }
      }
      this.$emit('updateCasted')
    },
    checkNo: function() {
      this.show = false;
     this.$refs.checkbox.checked = false
      window.console.log(this.msg !== "Peng" && this.peng);
      if (this.peng && this.msg !== "Peng") {
        (this.msg = "Peng"), (this.show = true);
        return;
      }

      if (this.msg !== "Chow" && this.Chow) {
        (this.msg = "Chow"), (this.show = true);
        return;
      }

      if (this.msg !== "Kong" && this.kong) {
        (this.msg = "Kong"), (this.show = true);
        return;
      }
      (this.go = false), (this.show = false);
      return;
    },

    backward(clickedItem, chowTiles) {
      chowTiles.forEach((e) => {
        if (clickedItem.length > 2 || e.tileSort !== clickedItem[0] - 1) {
          return;
        } else {
          clickedItem.unshift(e.tileSort),
            this.backward(clickedItem, chowTiles);
        }
      });
      return clickedItem;
    },

    concealed() {
      let data = this.myTiles,
        temp=data.slice(),
        kong = false
        let result=findPong(temp);
      window.console.log("consealed?", temp);
      return result
      //===================================================
      function findPong(data) {
        let groupBy = function(data, key) {
          return data.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        let c = groupBy(data, "tileSort");
        let value=Object.values(c)
        value.forEach(e=>{
          if(e.length===4){kong=true}
        })
        console.log(kong, value)
        return [kong, value]
      }
      //==================================================
     // return result;
    },
    chiPonKon: function(){
    console.log(this.lastCasted[0].id,' / ',this.lastCasted[1])
    if(this.chowAllowed||this.pengAllowed){
        this.blink=false
        this.tileClicked(this.lastCasted[1], 
        this.lastCasted[0].tileSort, 
        this.lastCasted[0].id)
       }
      this.castedShow=!this.castedShow
      return
    },

    hula: function(head, arg1, arg2, arg3) {
      window.console.log(head, arg1, arg2, arg3);
      if (head === "Hula") {
        let tiles= arg1.map((e) =>{return {tileSort:e.tileSort}});
        //tiles.forEach(e=>tiles.tileSort=e.tileSort)
        // tiles=Array.from(tiles);
        tiles = JSON.parse(JSON.stringify(tiles));
        window.console.log(tiles);
        let a = this.seeIfHula(tiles);
        window.console.log("Hula?/1", a);
        if (!a) {
          this.concealed();
        }
        else{this.hulaNow(tiles), this.mahjiongB=true}
        return
      }
      // this.hula('checkHula', areaIdx, tileSort, tileId)
      if (head === "checkHula") {
        let tiles = this.myTiles.map((e) =>{return {tileSort:e.tileSort}});
         tiles = JSON.parse(JSON.stringify(tiles));
         console.log(tiles)
        //let tiles2 = [];
        // tiles.push(arg2);
        let temp=tiles.slice()
       // temp.forEach((e) => tiles2.push({ tileSort: e }));
        temp.sort((a, b) => a.tileSort - b.tileSort);
        let a = this.seeIfHula(temp);
        if (a) {
          this.mahjiongB=true
          window.console.log("Hula?/2", a);//using arg[3]=tileId, [2]=areaIdx
          this.hulaNow(temp)//do something!!!!!!!!!!!!!
       }
       return this.mahjiongB
      }
    },

    seeIfHula(arg) {
      let tiles=arg.slice()
      console.log(tiles)
        let data=tiles.sort((a, b)=>{a.tileSort-b.tileSort})
        let result1=findPong(data)
        let leftOver1=Object.values(result1).slice()
      console.log(leftOver1, ' / ', 'grouping')
     if(leftOver1.length===5&&leftOver1.flat().length===14){
       //let tile1=leftOver1.flat();
                 console.log('FOUR PONGS')
                  this.mahjiongB=true
                  //this.hulaNow(tile1)
                  return true
     }
     else if(leftOver1.length===7&&leftOver1.flat().length===14)
        {let tile1=leftOver1.flat(); let a = findPair(tile1)
         if(a[0].length===7){
                 console.log('SEVEN PAIRS')
                  this.mahjiongB=true
                 // this.hulaNow(tile1)
                  return true
         }}
//no pongs for this tile
         let chow = findChowHand(data)
         let chow1=chow.sort((a, b)=>a.length-b.length)
         console.log(chow1, '/ data at line 328')
         if(chow1.length===5){
            this.mahjiongB=true
            //this.hulaNow(chow1)
            return true
      } 

//=============================================================
      let result=findPair(data)
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
        i=7; 
        // let tile=result[0].concat(pongs).flat()
                 console.log(pong, " / this is pong's result")
            this.mahjiongB=true
            //this.hulaNow(tile)
       } else if(pongs.length>0){
         let pong1=pongs.slice()
         for(let k=0; k<pong1.length; k++){
             let pong2=pong1.splice(pong1.length-k, k)
             let rest2=rest.concat(pong2).flat()
             console.log(pong2, ' / pong2', rest2, ' /rest2')
             let chow=findChowHand(rest2)
             if(chow.length===4-pong1.length)
             i=7; 
             //tile=(result[0].concat(chow.concat(pong1)).flat(2))
             this.mahjiongB=true
             //this.hulaNow(tile)
             return true
         }
       } else if(pongs.length===0){
        let chow = findChowHand(arg)
        if(chow.length===4){
              i=7; 
              //let tile=result[0].concat(chow).flat()
          console.log(chow, " / this is chow's result")
              this.mahjiongB=true
             // this.hulaNow(tile)
             return true
            }
         }
    // console.log("no mahjong to call!")
       }
  //}
          if (this.mahjiongB) {
            (this.chowChain = this.myTiles),
              (this.show = true),
              (this.msg = "Hula");
            return this.mahjiongB;
          } else {
            return (this.mahjiongB = false);
          }
       }  
        console.log("no mahjong to call!")
        return false
    },

    hulaNow(tiles){
      let length=this.myTiles.length
      let temp
      if(length<14)
      {
        temp=[...this.lastCasted[0], this.myTiles]
      }else{temp=this.myTiles}
      console.log(tiles, ' / Hula hand show')
      if (this.mahjiongB) {
            this.chowChain = temp.flat(),
             this.chowOption = true
              this.show = true
              this.msg = "Hula"
          //  return this.mahjiongB;
          } 
    },

    pairJustify(pairAndRest) {
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
    },
    chowSelected(index){
      if(index===1||index===this.chowChain.length-2){
        this.payload.push(this.chowChain[index])
      }  
      if(index===0){this.payload=[this.chowChain[0], 
      this.chowChain[1]]}
      if(index===this.chowChain.length-1){
        this.payload=[this.chowChain[this.chowChain.length-2], 
        this.chowChain[this.chowChain.length-1]]
        }
         if(this.payload.length===2){this.chowChain=[], 
             this.chowOption=false
          this.myTiles.find(this.makeChow)
    }},
        makeChow(e){
            this.payload.forEach(ele=>{
             if(e.id===ele.id){e.chiPenGan=1}
            })   
      }     
    // chowSelected(chowItem) {
    //   this.payload.push(chowItem)
    //   if(this.payload.length===2){this.chowChain=[], 
    //   this.chowOption=false
    //   }
    //   window.console.log(' / chowItem', chowItem);
    //   this.myTiles.find(makeChow)
    //   function makeChow(e){
    //     if(e.tileSort===chowItem.tileSort){e.chiPenGan=1}
    //   }
    //   // this.$emit("pengChowKong", this.payload )
    // },
      //  function chowIt(e){
      //      this.chowChain.map(ele=>ele.id===e.id?e.chiPenGan=1:'')
      //   }

    // handleData(itemSelected) {
    //   this.chowOption = false;
    //   window.console.log(itemSelected);
    // },
  }, //methods
};
//====================================================
// let chow = findChowHand(bigFourWinds)

// window.console.log(findPong(bigFourWinds)," pong")
// //let peng = findPong(bigTriDragon)
// window.console.log(grouping(chow), " chow&&pongs")
//=====================================================
</script>
<style scoped>
* {
  margin: 0px;
  padding: 0px;
}
img {
  height: 7vh;
  width: 5.5vh;
  box-shadow: 2px 1px 4px darkgreen;
}

.container {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
  height: 70vh;
  width: 80vw;
  z-index: 1;
  /* place-content: center; */
  /* align-content: center; */
  /* justify-self: center;   */
}
.lastCasted{
  display:grid;
  place-self: center;
  align-items: center;
  position:absolute;
  font-size: 4rem;
  cursor: pointer;
  /* height:10vh;
  width: 10vw; */
  aspect-ratio: 1 / 1; 
  border: none;
  padding: 15px;
  background: radial-gradient(
    circle,
    rgb(252, 180, 180) 0%,
    rgb(185, 9, 9) 70%,
    rgb(198, 4, 9) 28%,
    rgb(32, 3, 2) 100%
  );
  border-radius: 50%;
  z-index: 9;
}
.blink{
  animation: mymove2 4s infinite; 
  background: radial-gradient(
    circle,
    rgb(9, 255, 20) 0%,
    rgb(18, 150, 9) 70%,
    rgb(177, 238, 107) 28%,
    rgb(235, 176, 174) 100%
  );
}
 @keyframes mymove2 {
  from {
    background:  radial-gradient(
    circle,
    rgb(159, 159, 243) 0%,
    rgb(18, 20, 150) 70%,
    rgb(100, 100, 255) 28%,
    rgb(50, 180, 100) 100%
  );
  }
  to {
    background: radial-gradient(
    circle,
    rgb(9, 255, 20) 0%,
    rgb(18, 150, 9) 70%,
    rgb(177, 238, 107) 28%,
    rgb(235, 176, 174) 100%
  );
  }
} 
.seat {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-style: italic;
  color: rgb(4, 37, 21);
}
._self {
  position: relative;
  flex-wrap: wrap;
  grid-column: 9/-1;
  grid-row: 9/-1;
  background-color: rgb(221, 97, 14);
}
.self-b {
  position: absolute;
  display: inline-flex;
  flex-wrap: wrap;
  top: 0px;
}
.tile-back-tail {
  position: absolute;
  left: 2px;
  bottom: 1px;
  display: grid;
  grid-template: 1fr 1fr;
  align-items: center;
  justify-items: center;
}
.tile-back-tail img {
  box-shadow: 1px 1px 2px white;
}
.tail {
  position: absolute;
  color: white;
}

._right {
  position: relative;
  flex-wrap: wrap;
  grid-column: 9/-1;
  grid-row: 1/9;
  background-color: pink;
}
.right-b {
  position: absolute;
  display: inline-flex;
  flex-wrap: wrap-reverse;
  bottom: 0px;
}
._cross {
  position: relative;
  flex-wrap: wrap;
  grid-column: 1/9;
  grid-row: 1/9;
  background-color: rgb(91, 91, 238);
}
.cross-b {
  position: absolute;
  display: flex;
  flex-wrap: wrap-reverse;
  flex-direction: row-reverse;
  bottom: 0vh;
  right: 0vh;
}
._left {
  position: relative;
  grid-column: 1/9;
  grid-row: 9/-1;
  background-color: yellow;
}
.left-b {
  position: absolute;
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  right: 0vh;
  top: 0vh;
}
.tile-back-front {
  position: absolute;
  bottom: 1px;
  right: 2px;
  display: grid;
  align-items: center;
  justify-items: center;
  place-items: center;
}
.tile-back-front img {
  box-shadow: 2px 2px 4px white;
}
.front {
  position: absolute;
  color: white;
}
.pengChowKong {
  display: flex;
  flex-direction: column;
  position: absolute;
  color: red;
  font-weight: 600;
  height: 20vh;
  width: 20vh;
  animation: mymove1 6s infinite;
  background: conic-gradient(
    from 195deg,
    white,
    #43a5dd,
    #3b4ea5 80%,
    rgb(45, 31, 175)
  );
  opacity: 0.8;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 9;
}
@keyframes mymove1 {
  from {
    background: conic-gradient(
      from 60deg,
      white,
      #43a5dd,
      #3b4ea5 80%,
      rgb(45, 31, 175)
    );
  }
  to {
    background: conic-gradient(
      from 225deg,
      white,
      #43a5dd,
      #3b4ea5 80%,
      rgb(45, 31, 175)
    );
  }
}
.pengChowKong::before {
  content: "Ya!";
  color: white;
}
.pengChowKong::after {
  content: "No!";
  color: white;
}
.nameS {
  position: absolute;
  display: flex;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: sans-serif;
  right: 5px;
  bottom: 5px;
  padding: 0;
  border-radius: 8px;
  background: rgb(91, 91, 238);
}

.nameR {
  position: absolute;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: sans-serif;
  padding: 0;
  border: 1px solid gray;
  background-color: yellow;
  border-radius: 8px;
  writing-mode: vertical-rl;
  text-orientation: sideways;
  transform: rotate(180deg);
  right: 5px;
  top: 5px;
}
.nameC {
  position: absolute;
  display: flex;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: sans-serif;
  border: 1px solid gray;
  border-radius: 8px;
  background-color: rgb(221, 97, 14);
  left: 5px;
  top: 5px;
}
.nameL {
  position: absolute;
  display: flex;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: sans-serif;
  border: 1px solid gray;
  border-radius: 8px;
  background-color: pink;
  writing-mode: vertical-rl;
  text-orientation: sideways;
  left: 5px;
  bottom: 5px;
}
.section {
  display: flex;
  flex-wrap: wrap;
  /* flex-direction: column; */
  position: absolute;
  bottom: 50%;
  color: red;
  font-weight: 600;
  height: auto;
  width: auto;
  padding: 20px;
  background: radial-gradient(
    circle at top left,
    white,
    #43a5dd,
    #3b4ea5 80%,
    rgb(45, 31, 175)
  );
  opacity: 1;
  align-items: center;
  justify-content: center;
  border-radius: 20%;
  background-size: contain;
  z-index: 9;
}
section img{
  object-fit: contain;
}
.selectHide {
  display: inline-flex;
  place-self: center;
}
.btn {
  height: 5vh;
  width: 5vh;
  border-radius: 50%;
  color: #ff0011;
  font-weight: 900;
  background: black;
  margin: 2px;
}
/* .chowOp{
  /* position:absolute; */
/* height:50%;
  width:50%;
  color: red; */
/* background-image: url("../assets/facai.png"); */
/* z-index: 9999; */
/* } */
.inturn {
  animation: mymove 4s infinite;
}
@keyframes mymove {
  from {
    color: white;
    background-color: #ff0011;
  }
  to {
    color: black;
    background-color: rgb(251, 255, 0);
  }
}
@media screen and (max-width: 1200px) {
  .container {
    display: grid;
    max-height: none;
    width: 75vw;
    align-self: center;
    justify-self: center;
  }
  img {
    height: 7.5vh;
    box-shadow: 2px 1px 4px darkgreen;
  }
}
/* @media screen and (max-width: 401px) { */
/* .container{ */
/* display: grid; */
/* height: auto; */
/* width: 70vw; */
/* align-self: center; */
/* justify-self: center; */
/* } */
/* img { */
/* height: 6vh; */
/* } */
/* } */
@media screen and (min-width: 400px) {
  .container {
    display: grid;
    place-content: center;
    /* min-height: 63vh;
     width: 70vw;
     align-self: center;
     justify-self: center; */
  }
  img {
    height: 7vh;
  }
}
/*  class='chowOp'
                  v-for="(chowItem,i) of chowChain"
                  :key="i"
   <img 
                       :src="require(`../assets/${chowItem.url}.png`)"
                       :alt="`${tile.url}`"
                  @change="
                    selected=chowItem;
                    chowOption=false;
                    chowSelected(chowItem, i);"
                    > */
</style>
