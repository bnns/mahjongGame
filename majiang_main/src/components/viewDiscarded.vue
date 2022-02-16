<template>
  <div  class='container'>
  <div class='_self'>
    <a class="tile-back-tail" 
       @click="$emit('getTile', self)">
       <img src="../assets/back_m.png" alt="image lost"/>
       <h4 class='tail'>{{tilesOnTableLength}}</h4>
    </a>
    <div class="self-b">
       <img v-for ='(tile, index) in getDisCardedTiles(`${self}`)'
            :key ='index'
            :src="require(`../assets/${tile.url}.png`)"
            :alt="`${tile.url}`"
            
             v-on:click="tileClicked(`${self}`,`${tile.tileSort}`)"/>
    </div>
    <button class='nameS color'
            :class='goAhead[self]&&myTurn'
            @click="$emit('mahjiong', self)">
                <!-- pong, chow, pair for hula -->
            {{users?users[self].name:'Here'}}
    </button>
    <div class="seat">{{users[self].mySeat}}</div>
</div>    <!-- sort tiles -->

  <div class='_right'>
     <div class="right-b">
    <img v-for='(tile, index) in getDisCardedTiles(`${right}`)'
         :key ='index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
           v-on:click="tileClicked(`${right}`,`${tile.tileSort}`)"
         />
     </div><h3 class='nameR color'
         :class='goAhead[right]&&myTurn'>{{users[right].name}}</h3>
          <div class="seat">{{users[right].mySeat}}</div>
  </div>
  <div class='_cross'>
    <div class="cross-b" >
         <img  v-for='(tile, index) in getDisCardedTiles(`${cross}`)'
         :key='index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
           v-on:click="tileClicked(`${cross}`,`${tile.tileSort}`)"
         />
    </div><h3 class='nameC color'
         :class='goAhead[cross]&&myTurn'>
         {{users[cross].name}}</h3>
          <div class="seat">{{users[cross].mySeat}}</div>
  </div>
  <div class='_left'>
     <a class="tile-back-front" 
       @click="$emit('getTile', self)">
       <img src="../assets/back_m.png" alt="image lost"/>
       <h4 class='front'>{{frontTileBack}}</h4>
    </a>
    <div class="left-b">
         <img  v-for='(tile, index) 
              in getDisCardedTiles(`${left}`)'
              :key ='index'
              :src="require(`../assets/${tile.url}.png`)"
              :alt="`${tile.url}`"
              v-on:click="tileClicked(`${left}`,`${tile.tileSort}`)"
         />
    </div><h3 class='nameL color'
             :class='goAhead[left]&&myTurn'>{{users[left].name}}
         </h3>
          <div class="seat">{{users[left].mySeat}}</div>
  </div>
  </div>
</template>

<script type="text/javascript">
  import { mapGetters } from 'vuex'

  export default {
  name:'ViewDiscarded',
  props: ['self', 'right', 'cross', 
  'left', 'users', 'goAhead', 
  'tilesOnTableLength','frontTileBack'],
      data () {
       return {
         myTurn: 'inturn',
        }
      },

      computed: {
        ...mapGetters ([
          'getTiles',
          'getDisCardedTiles'
        ]),
      },

      methods: {
      // action(a){this.getPublicTiles(a)},
      tileClicked(b, c){//b:hand.index, c:tile.tileSort
      let peng=0, chow=0
      this.getTiles(b).forEach(ele=> 
          {if(b!==this.self){(ele.tileSort===c)
           ?peng++
           :window.console.log("不能碰，吃!"+b+"/?"+c)}
           if(b+1===this.self||this.self+3===b)
           {(ele.tileSort===c-1||c+1)
            ?chow++
            :window.console.log("吃？!"+b+"/?"+c)
           }
            window.console.log("Peng", peng)
            window.console.log("Chow", chow)
           });
         }
        }//methods
      }
</script>
<style scoped>
  * {
    margin: 0px;
    padding: 0px;
  }
 img {
   height: 7vh;
   width: 5.5vh;
 }

 .container{
   display: grid;
   grid-template-columns: repeat(16, 1fr);
   grid-template-rows: repeat(16, 1fr);
   height: 70vh;
   width: 80vw;
   align-self: center;
   justify-self: center; 
 }
 .seat{
   display:flex;
   position:absolute;
   left:50%;
   top:50%;
   transform: translate(-50%, -50%); 
   font-style:italic;
   color:rgb(4, 37, 21);
 }
 ._self {
   position: relative;
   flex-wrap: wrap;
   grid-column: 9/-1;
   grid-row: 9/-1;
   background-color: rgb(221, 97, 14);
 }
 .self-b{
   position:absolute;
   display: inline-flex; 
   flex-wrap:wrap;
   top:0px;
 }
 .tile-back-tail{
   position: absolute;
   left: 2px;
   bottom: 1px;
   display: grid;
   grid-template:1fr 1fr;
   align-items: center;
   justify-items: center;
}
 .tail{
  position: absolute;
  color:white;
}

 ._right {
   position: relative;
   flex-wrap: wrap;
   grid-column: 9/-1;
   grid-row: 1/9;
   background-color: pink;
 }
 .right-b{
   position:absolute;
   display: inline-flex; 
   flex-wrap:wrap-reverse;
   bottom:0px;
 }
 ._cross {
   position: relative;
   flex-wrap: wrap;
   grid-column: 1/9;
   grid-row: 1/9;
   background-color: rgb(91, 91, 238);
 }
 .cross-b{
  position:absolute; 
  display:flex;
  flex-wrap: wrap-reverse;
  flex-direction: row-reverse;
  bottom:0vh;
  right:0vh;
 }
._left {
   position: relative;
   grid-column: 1/9;
   grid-row: 9/-1;
   background-color: yellow;
 }
 .left-b{
   position:absolute;
   display:inline-flex;
   flex-wrap: wrap;
   flex-direction: row-reverse;
   right:0vh;
   top:0vh; 
 }
.tile-back-front{
   position: absolute;
   bottom:1px;
   right:2px;
    display: grid;
   align-items: center;
   justify-items: center;
}
.front{
  position: absolute;
  color:white;
 
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
  background-color:yellow ;
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
  background-color:rgb(221, 97, 14);
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
  background-color:pink;
  writing-mode: vertical-rl;
  text-orientation: sideways;
  left: 5px;
  bottom: 5px;
}
.inturn {
   animation: mymove 4s infinite;
}
@keyframes mymove {
  from {
    color:white;
    background-color: #ff0011;
  }
  to {
    color:black;
    background-color: rgb(251, 255, 0);
  }
}
 @media screen and (max-width: 1200px) {
     .container{
      display: grid;
       max-height: none;
       width: 75vw;
       align-self: center;
       justify-self: center;
     }
     img {
       height: 7vh;
     }
     /* ._left>img { */
       /* width: 6vw; */
       /* height: 4vh; */
     /* } */
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
   .container{
    display: grid;
     min-height: 63vh;
     width: 70vw;
     align-self: center;
     justify-self: center;
   }
   img {
     height: 7vh;
   }
  }
</style>
