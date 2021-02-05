
<template >
  <div id="viewMelded" class='container'>
  <div class='_self'>
    <a
    v-on:click="action(`${self}`)">
    </a>
    <img v-for = '(tile, index) in getMeldedTiles(`${self}`)'
         :key ='index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
         class='self'
           v-on:click = " tileClicked(`${self}`,`${tile.id}`)"
         />
  </div>
  <div class='_right'>
    <a class='right-b'
    v-on:click="action(`${right}`)">
    </a>
    <img class='right-b' v-for = '(tile, index) in getMeldedTiles(`${right}`)'
         :key = 'index'
         :src="require(`../assets/${tile.url}_s.png`)"
         :alt="`${tile.url}`"
           v-on:click = "tileClicked(`${right}`,`${tile.id}`)"
         />
  </div>
  <div class='_cross'>
    <a class='cross-b'
      v-on:click="action(`${cross}`)">
    </a>
    <img class='cross-b' v-for = '(tile, index) in getMeldedTiles(`${cross}`)'
         :key = 'index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
           v-on:click = "tileClicked(`${cross}`,`${tile.id}`)"
         />
  </div>
  <div class='_left'>
    <a class='left-b'
     v-on:click="action(`${left}`)">
    </a>
    <img class='left-b' v-for = '(tile, index) in getMeldedTiles(`${left}`)'
         :key = 'index'
         :src="require(`../assets/${tile.url}.png`)"
         :alt="`${tile.url}`"
         v-on:click = "tileClicked(`${left}`,`${tile.id}`)"
         />
  </div>
  <!-- <div class="_center">
    <button>
    <img src="../assets/back_m.png" alt="Image lost..." v-on:click="action(`${self}`)"/>
    </button>
  </div> -->
  </div>
</template>

<script type="text/javascript">
  import { mapGetters } from 'vuex'

  export default {
  name: 'viewMelded',
  props: ['self', 'right', 'cross', 'left', 'name'],
  // data () {
  //  return {
    //  self: 0,
    //  right: 1,
    //  cross: 2,
    //  left: 3
  // }
// },
computed: {
  ...mapGetters ([
 'getPublicTiles',
 'getMeldedTiles'
  ]),
},
methods: {
  action(a){this.getPublicTiles(a)},
  tileClicked(b, c){window.console.log(b + c)}
},
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
 ._right img{
   height: 5vh;
   width: 7vh;
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
 ._self {
   display: flex;
   flex-wrap: wrap;
   grid-column: 9/-1;
   grid-row: 9/-1;
   background-color: gray;
 }
 ._right {
   display: flex;
   /* transform: rotate(180deg); */
   grid-column: 9/-1;
   grid-row: 1/9;
   background-color: pink;
   flex-wrap: wrap;
   flex-direction: column-reverse;
 }
 .right-b{
   display: flex;
   flex-direction: column;

 }
 ._cross {
   display: flex;
   flex-wrap: wrap;
   /* transform: rotate(180deg); */
   grid-column: 1/9;
   grid-row: 1/9;
   background-color: blue;
   flex-direction: row-reverse;
 }
 .cross-b{
   align-self: flex-end;
 }
 ._left {
   display: flex;
   grid-column: 1/9;
   grid-row: 9/-1;
   background-color: yellow;
   flex-direction: column-reverse;
   transform: rotate(180deg);
 }
 .left-b{
   align-self: flex-start;
   flex-wrap: wrap;
   transform: rotate(270deg);
 }
 /* ._center {
   grid-column: 7/11;
   grid-row: 7/11;
   background: green;
   color: white;
  align-self: center;
  justify-self: center;
  z-index: 10;
 } */
 @media screen and (max-width: 1200px) {
     .container{
      display: grid;
       height: 80vh;
       width: 75vw;
       align-self: center;
       justify-self: center;
     }
     img {
       height: 6vh;
     }
 }
 @media screen and (min-width: 550px) {
    .container{
     display: grid;
      height: 83vh;
      width: 65vw;
      align-self: center;
      justify-self: center;
    }
    img {
      height: 6vh;
    }
  }
  @media screen and (min-width: 300px) {
   .container{
    display: grid;
     height: 65vh;
     width: 70vw;
     align-self: center;
     justify-self: center;
   }
   img {
     height: 6vh;
   }
  }
</style>
