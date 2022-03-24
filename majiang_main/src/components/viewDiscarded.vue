<template>
  <div class="container" refs="container">
    <div  :class="{blink:(chowAllowed||pengAllowed)&&blink}"
          class="lastCasted center"
          @mouseover="chiPonKon2()"
          @mouseout="chiPonKon3()"
          @click="chiPonKon()">
          <img
            :src="require(`../assets/${lastCasted[0].url}.png`)"
            :alt="`${lastCasted[0].url}`"
            v-show="!castedShow||castedShow2"
          />
    </div>

    <div
      class="pengChowKong center"
      v-if="`${peng || chow || kong }` && show && !restartB">
      <input ref='checkbox' type="checkbox" @change="this.checkYes" />
      {{ msg + " ?" }}
      <input ref="checkbox" type="checkbox" @change="this.checkNo" />
    </div>

    <div class="section center" v-if="chowOption">
           <section
             :class="{ selectHide: chowOption }"
             v-for="(chowItem, index) of chowChain"
             :key="index"
             multiple="multiple">
               <img
                 :src="require(`../assets/${chowItem.url}.png`)"
                 :alt="`${chowItem.url}`"
                 @click="chowSelected(index)"
               />
          </section>
    </div>
    <!-- ======================================================== -->
    <div
      class="center restart" :msg='msg' @click="restart(msg)"
      v-if=" restartB "><p class="msg">{{msg}}</p>
      <input class="restart" type="button" />
    </div>

    <div class="section center" v-if="restartB">
           <section
             :class="{ selectHide: restartB }"
             v-for="(item, index) of showChain"
             :key="index"
             multiple="multiple">

               <img
                 :src="require(`../assets/${item.url}.png`)"
                 :alt="`${item.url}`"
               />
          </section>
    </div>

    <div class="_self">
      <a class="tile-back-tail" @click="$emit('getTile', self)">
        <img src="../assets/back_m.png" alt="image lost" />
        <h4 class="tail">{{ tilesOnTableLength }}</h4>
      </a>
      <div class="self-b" v-show="castedShow">
        <img
          v-for="(tile, index) in discardedTiles[self]
          .slice(tilesShown)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt='tile.url'
          v-on:click="tileClicked(self, tile.tileSort, tile.id, tile)"
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
          .slice(tilesShown)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt="`${tile.url}`"
          @click="tileClicked(right, tile.tileSort, tile.id, tile)"
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
          .slice(tilesShown)"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt="`${tile.url}`"
          v-on:click="tileClicked(cross, tile.tileSort, tile.id, tile)"
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
          v-for="(tile, index) in discardedTiles[left]?discardedTiles[left]
          .slice(tilesShown):[{url:'board'}]"
          :key="index"
          :src="require(`../assets/${tile.url}.png`)"
          :alt="`${tile.url}`"
          v-on:click="tileClicked(left, tile.tileSort, tile.id, tile)"
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
    "iWon",
    'restartFlag',
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
      chowChain: [{url:''}],
      showChain:[{url:''}],
      go: false,
      show: false,
      chowOption: false,
      msg: "",
      castedShow:false,
      castedShow2:false,
      tilesShown:0,
      blink:false,
      peng: false,
      chow: false,
      kong: false,
      mahjiongB: false,
      restartB:false,
      isRestart:this.restartFlag,
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
         console.log(val, 'pengAllowed watch')
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
   
    iWon: {
      handler(val) {
        if (val) {
            this.show = true,
            this.castedShow = this.peng
            =this.chow=this.kong
            =this.mahjiongB = false,
            this.msg = `${this.users[val[1]].name}`+' WON',
            this.showChain = val[0],
            this.restartB = true
        }else{this.restartB=this.castedShow2=this.show=false}
      }
    },
     isRestart(val) {
        if(val){
          this.restart()
        }
    } 
  },

  methods: {
    // action(a){this.getPublicTiles(a)},
    tileClicked(areaIdx, tileSort, tileId, tile) {
      console.log(this.chowChain, 'chowChain/', tileId)
      //b:area.index, c:tileSort, d:tileId
      //  window.console.log(areaIdx,' / ',tileSort,' / ',tileId, '/',this.self)
      // this.mahjiongB = this.hula("checkHula", areaIdx, tileSort, tileId);
      // if(this.mahjionB){this.hulaNow()}
      if (tileSort !== this.lastCasted[0].tileSort) {
        alert("not last one!");
        return;
      }
       if(!this.goAhead){this.hula('Hula', this.myTiles)}//????????????
      if (!this.mahjiongB) {
        let peng = [tileSort],//tile.tileSort
            chow = [tileSort];
        this.getTiles(this.self).forEach((ele) => {
          let a = this.self - 1 < 0 ? 3 : this.self - 1;
          if (areaIdx !== this.self) {
            ele.chiPenGan===0&&ele.tileSort === peng[0] 
            ? peng.push(peng[0]) : "";
          }
          if (areaIdx === a && tileSort < 210) {
            let counter = 0;
            ele.chiPenGan===0&&ele.tileSort === chow[0] - 1 
              ? (chow = this.backward(chow, this.getTiles(this.self)))
              : ele.tileSort === chow[chow.length - 1] + 1 && counter < 2 //2 times at most
              ? (chow.push(ele.tileSort), counter++)
              : "";
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
             ( e.tileSort < (tileSort + 3) && e.tileSort >( tileSort - 3))
                ? this.chowChain.push(e)
                : "";
            });
          }
          this.chowChain = chow.slice();//+2>chow>-2
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
       this.mahjiongB = this.hula("checkHula", areaIdx, tileSort, tileId, tile)}
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
            this.chow = this.kong = this.mahjiongB = false;
            let counter=0
            this.myTiles.forEach(e=>{if(counter==3){return}
            e.chiPenGan===0&&e.tileSort===this.lastCasted[0].tileSort?(e.chiPenGan=2,
            counter++):''})
        }
      if (this.msg === "Kong") {
        this.chow = this.peng = this.mahjiongB = false;
        this.$emit('updTileCount')
            let counter=0
            this.myTiles.map(e=>{
            e.chiPenGan===0&&e.tileSort===this.lastCasted[0].tileSort
            ?(e.chiPenGan=3, counter++):''})
        }

      if (this.msg === "Chow") {
         this.peng = this.kong = this.mahjiongB = false;
     console.log(this.chowChain, ' / chowchain')
           if(this.chowChain.length>2&&this.chow){
    
             this.chowChain.find((e, i, array)=>
             e===this.lastCasted[0].tileSort
             ?array.splice(i, 1):'')
     console.log(this.chowChain, ' / chowChain no lastCasted')
           }
           if(this.chowChain.length===2&&this.chow){
              let copy=this.chowChain.slice()
             this.myTiles.forEach((e)=>//find? forEach?
             copy.forEach((ele, i, array)=>ele===e.tileSort&&e.chiPenGan===0
             ?(e.chiPenGan=1, array.splice(i, 1))
             :''))
           }
       }

      if (this.msg === "Hula") {
         this.chow = this.kong = this.peng = false
          if (this.mahjiongB) {
         let tempTile
          if(this.myTiles.length<this.tilesCount[this.self])//tilesCount[this.self]
          {
            tempTile=this.myTiles
            tempTile.push(this.lastCasted[0])
          }else{tempTile=this.myTiles}
            console.log(tempTile, ' / hula hands!')
            this.mahjiongB=this.go=this.show=false
            if(!this.restartB){this.$emit("hula", [tempTile, this.self])}//???????????????????????
          }
      }
      this.go = true;
      if (this.go&&this.payload!==null) {//this.payload ????????????????
        window.console.log(this.payload)
        this.$emit("pengChowKong", this.payload)
        this.payload=[]
        if (this.chow) {
          let array = this.myTiles;
          let chow = this.chowChain.slice();
          this.chowChain = [];
          chow = chow.filter((e) =>
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
      console.log(this.msg !== "Peng" && this.peng);
      if (this.msg !== "Peng"&&this.peng) {
        (this.msg = "Peng"), (this.show = true);
        return;
      }

      if (this.msg !== "Chow"&&this.chow) {
        (this.msg = "Chow"), (this.show = true);
        return;
      }

      if (this.msg !== "Kong"&&this.kong) {
        (this.msg = "Kong"), (this.show = true);
        return;
      }
      (this.go = false), (this.show = false);
      return;
    },

    backward(clickedItem, chowTiles) {
      chowTiles.forEach((e) => {
        if (clickedItem.length > 2 || e.tileSort !== clickedItem[0] - 1||e.chiPenGan!==0) 
        {
          return
        } else {
          clickedItem.unshift(e.tileSort),
            this.backward(clickedItem, chowTiles);
        }
      });
      return clickedItem;
    },

    concealed() {
        let data = this.myTiles, conPong,
        temp=data.slice()
        //kong = false
        let result=findPong(temp);
     
        temp=Object.values(result)
         console.log("consealed?", temp);
         temp.forEach(e=>e.length===4&&e.chiPenGan!==4?conPong=e:'')
         console.log(conPong[0].tileSort, ' / conPong')
          if(conPong.length===4){this.myTiles.forEach(e=>
          e.tileSort===conPong[0].tileSort?(e.chiPenGan=3, console.log(e)):'')
           this.$emit('updTileCount')
          }    
      return
    },
      //===================================================
      // function findPong(data) {
      //   let groupBy = function(data, key) {
      //     return data.reduce(function(rv, x) {
      //       (rv[x[key]] = rv[x[key]] || []).push(x);
      //       return rv;
      //     }, {});
      //   };
      //   let c = groupBy(data, "tileSort");
      //   let value=Object.values(c)
      //   value.forEach(e=>{
      //     if(e.length===4){kong=true}
      //   })
      //   console.log(kong, value)
      //   return [kong, value]
      // }
      //==================================================
    // toggleIt: function(){
    //     this.castedShow2=!this.castedShow2
    // },
    chiPonKon: function(){
    console.log(this.lastCasted[0].id,' / ',this.lastCasted[1])
    if(this.chowAllowed||this.pengAllowed){
        this.blink=false
        this.tileClicked(this.lastCasted[1], 
        this.lastCasted[0].tileSort, 
        this.lastCasted[0].id)
       }
      this.castedShow2=!this.castedShow2
      if(this.castedShow2===false){this.castedShow=true}
      console.log(this.castedShow, ' / 2', this.castedShow2)
      return
    },
    chiPonKon2:function(){//mouse move in
      this.tilesShown=0//show all discarded tiles
      this.castedShow=true
    },
    chiPonKon3:function(){//mouse move out
      //this.tilesShown=-3//show discarded Tiles in brouser
     this.castedShow=false
    },

    hula: function(head, arg1, arg2, arg3, tile) {
      console.log(head, arg1.length===this.tilesCount[this.self]-1, arg2, arg3);
      if (head === "Hula") {
        if(arg1.length===this.tilesCount[this.self]-1){arg1.push(this.lastCasted[0])}
        console.log(arg1, ' / hula ?')
        let tiles= arg1.map((e) =>{return {tileSort:e.tileSort}});
        //tiles.forEach(e=>tiles.tileSort=e.tileSort)
        // tiles=Array.from(tiles);
        tiles = JSON.parse(JSON.stringify(tiles));
        console.log(tiles);
        let a = this.seeIfHula(tiles);
        window.console.log("Hula?/1", a);
        if (!a) {
          let temp = this.concealed()
          temp = Object.values(temp)
          console.log(temp)
        }
        else{this.hulaNow(tiles), this.mahjiongB=true}
        return
      }
      // this.hula('checkHula', areaIdx, tileSort, tileId)
      if (head === "checkHula") {
        
        let tiles = this.myTiles.map((e) =>{return {tileSort:e.tileSort}});
        if(tiles.length<this.tilesCount[this.self]){tiles.push({tileSort:tile.tileSort})}
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
       console.log(pongs.length, '/ check pong length')
       if(pongs.length===4&&rest.length===0){
        i=7; 
        // let tile=result[0].concat(pongs).flat()
                 console.log(pong, " / this is pong's result")
            this.mahjiongB=true 
            return this.mahjiongB
            //this.hulaNow(tile)
       } else if(pongs.length>0){
         let pong1=pongs.slice()
         for(let k=0; k<pong1.length; k++){
             let pong2=pong1.splice(pong1.length-k, k)
             let rest2=pong2!==[]?rest.concat(pong2):rest
             let chow=findChowHand(rest2)
              console.log(pong1, ' / pong1', chow, ' /chow')
             if(chow.length+pong1.length===4){
             i=7; 
            //  let tile=(chow.concat(chow.concat(pong1)),
             this.mahjiongB=true
             return true
             }
         }
       } else if(pongs.length===0){
        let chow = findChowHand(arg)//arg from pairjustify length = 12
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

    hulaNow(tiles){//rememb to use this.tiles
      let length=this.myTiles.length
      let temp=this.myTiles.slice()
      if(length<14)
      {
        temp.push(this.lastCasted[0])
      }

      console.log(tiles, temp, ' / Hula hand show')
      if (this.mahjiongB) {
        this.peng=this.chow=this.kong=false
            this.chowChain = temp
             this.chowOption = true
              this.show = true
              this.msg = "Hula"
          //  return this.mahjiongB;
          } 
    },
    restart(){
      let index = this.iWon[1]
      if(this.self===this.iWon[1]){this.$emit("restart", index)}
      this.payload= null,
      this.chowChain=[],
      this.showChain=[],
      this.go =this.show=this.chowOption=this.blink=false,
      this.peng=this.chow=this.mahjiongB=this.restartB=false,
      this.msg="",
      this.castedShow=true,
      this.isRestart=false
      console.log("restart / ", this.self)
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
      if((index===1||index===this.chowChain.length-2)){
        this.payload.push(this.chowChain[index])
      } 
      if(index===0)
        {
        this.payload=[this.chowChain[0], 
        this.chowChain[1]]
      }
      if(index===this.chowChain.length-1)
        {
        this.payload=[this.chowChain[this.chowChain.length-2], 
        this.chowChain[this.chowChain.length-1]]
        }
         if(this.payload.length===2)
        {
        this.chowChain=[], 
        this.chowOption=false
        this.myTiles.find(this.makeChow)
        }
    },

    makeChow(e){
            this.payload.forEach(ele=>{
             if(e.id===ele.id){e.chiPenGan=1}
            })   
    }     
 
  }, //methods
};
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
  display:-webkit-grid;
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
  display:-webkit-grid;
   display: -moz-grid;
  place-self: center;
  align-items: center;
  position:absolute;
  /* font-size: 4rem; */
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

.pengChowKong{
  display: flex;
  flex-direction: column;
  position: absolute;
  color: red;
  font-weight: 600;
  height: 20vh;
  width: 20vh;
  animation: mymove1 1s infinite;
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
  z-index: 1;
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
 .restart{
  display: flex;
  flex-direction: column;
  position: absolute;
  color: red;
  font-weight: 600;
  height: 20vh;
  width: 20vh;
  animation: mymove1 1s infinite;
  background: conic-gradient(
    from 360deg,
    white,
    #43a5dd,
    #3b4ea5 80%,
    rgb(45, 31, 175)
  );
  opacity: 0.8;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1;
}
@keyframes mymove1 {
  from {
    background: conic-gradient(
      from 0deg,
      white,
      #031d2c,
      #2e4091 80%,
      rgb(12, 5, 71)
    );
  }
  to {
    background: conic-gradient(
      from 180deg,
      rgb(12, 5, 71)
      #2e4091 80%,
      #031d2c,
      white,
    );
  }
}
.restart::after{
  content:'Restart';
  color:gold;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  z-index: 9;
}
.restart::before{
  content:'Hula !!!';
  color:rgb(255, 0, 0);
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  z-index: 9;
}
.msg{
  color: white;
  z-index: 9;
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
  bottom: 47%;
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
  .lastCasted{
  display:grid;
  display:-webkit-grid;
  place-self: center;
  align-items: center;
  position:absolute;
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
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2)
 { .container {
    display: grid;
    display: -moz-grid;
    place-content: center;
    /* min-height: 63vh;
     width: 70vw;*/
     align-self: center;
     justify-self: center; 
  }
  img {
    height: 7vh;
  }
  .lastCasted{
  display:grid;
  place-self: center;
  /* align-items: center; */
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
}

</style>
