<template >
  <div id="viewMelded" class='container'>
  <div class='_self'>
    <a class="selfS" 
    @click="$emit('getTile', self)">
    <img src="../assets/back_m.png" alt="image lost"/>
    <h4 class='length'>{{tilesOnTableLength}}</h4></a>
    <img v-for = '(tile, index) in getMeldedTiles(`${self}`)'
         :key ='index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
         class='self'
           v-on:click = " tileClicked(`${self}`,`${tile.id}`)"
         /><p class='nameS'
                :class='goAhead[self]&&myTurn'
                @click="$emit('mahjiong', self)">
           {{users[self].name}}</p>
  </div>    <!-- sort tiles -->

  <div class='_right'>
    <!-- <a class='right-b' -->
    <!-- v-on:click="action(`${right}`)"> -->
    <!-- </a> -->
    <img class='right-b' v-for = '(tile, index) in getMeldedTiles(`${right}`)'
         :key = 'index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
           v-on:click = "tileClicked(`${right}`,`${tile.id}`)"
         /><h3 class='nameR'
         :class='goAhead[right] && myTurn'>{{users[right].name}}</h3>
  </div>
  <div class='_cross'>
    <!-- <a class='cross-b' -->
      <!-- v-on:click="action(`${cross}`)"> -->
    <!-- </a> -->
    <img class='cross-b' v-for = '(tile, index) in getMeldedTiles(`${cross}`)'
         :key = 'index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
           v-on:click = "tileClicked(`${cross}`,`${tile.id}`)"
         /><h3 class='nameC'
         :class='goAhead[cross]&&myTurn'>{{users[cross].name}}</h3>
  </div>
  <div class='_left'>
    <!-- <a class='left-b' -->
     <!-- v-on:click="action(`${left}`)"> -->
    <!-- </a> -->
    <img class='left-b' v-for = '(tile, index) in getMeldedTiles(`${left}`)'
         :key = 'index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
         v-on:click = "tileClicked(`${left}`,`${tile.tileSort}`)"
         /><h3 class='nameL'
         :class='goAhead[left]&&myTurn'>{{users[left].name}}</h3>
  </div>
  </div>
</template>

<script type="text/javascript">
  import { mapGetters } from 'vuex'

  export default {
  name: 'viewMelded',
  props: ['self', 'right', 'cross', 
  'left', 'users', 'goAhead', 
  "tilesOnTableLength"],
      data () {
       return {
         myTurn: 'inturn',
        }

      },

      computed: {
        ...mapGetters ([
       'getPublicTiles',
       'getMeldedTiles'
        ]),
      },

      methods: {
  action(a){this.getPublicTiles(a)},
  tileClicked(b, c){window.console.log(b + c)}
      }
 }
</script>
<style scoped>
  * {
    margin: 0px;
    padding: 0px;
  }
 img {
   height: 7vh;
   width: 5vh;
 }
 /* ._right img{ */
   /* height: 5vh; */
   /* width: 7vh; */
 /* } */
 .container{
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
   height: 70vh;
   width: 80vw;
   align-self: center;
   justify-self: center; 
 }
 ._self {
   position: relative;
   display: flex;
   flex-wrap: wrap;
   grid-column: 9/-1;
   grid-row: 9/-1;
   background-color: gray;
 }
 ._right {
   position: relative;
   display: flex;
   flex-wrap: wrap;
   grid-column: 9/-1;
   grid-row: 1/9;
   background-color: pink;
   flex-direction: row;
   align-items: flex-end;
 }
 .right-b{
   display: flex;
   flex-direction: column;

 }
 ._cross {
   position: relative;
   display: flex;
   flex-wrap: wrap;
   grid-column: 1/9;
   grid-row: 1/9;
   background-color: blue;
   flex-direction: row-reverse;
 }
 .cross-b{
   align-self: flex-end;
 }
 ._left {
   position: relative;
   display: flex;
   flex-wrap: wrap;
   grid-column: 1/9;
   grid-row: 9/-1;
   background-color: yellow;
   flex-direction: row;
   align-content: flex-end;
   transform: rotate(180deg); 
 }
 .left-b{
   align-self: flex-start;
   flex-wrap: wrap;
   transform: rotate(180deg);
 }
.nameS {
  position: absolute;
  display: flex;
  right: 2%;
  bottom: 5%;
}
.selfS{
  position: absolute;
  display: flex;
  left: 2%;
  bottom: 5%;
}
.length{
  position: absolute;
  z-index: 1;
  left: 3%;
  bottom: 1%;
}
.nameR {
  position: absolute;
  display: flex;
  transform: rotate(-90deg);
  right: 0%;
  top: 10%;
}
.nameC {
  position: absolute;
  display: flex;
  left: 0%;
  top: 5%;
}
.nameL {
  position: absolute;
  display: flex;
  transform: rotate(-90deg);
  right: 0%;
  top: 10%;
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
       height: 6vh;
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
     height: 6vh;
   }
  }
</style>
