<template>
  <div class="left">
    <button>
      <img v-for="tile in leftTiles" :key="tile.index" :src="require(`../assets/${tile.url}.png`)" :alt="tile.url"/>
    </button>
  </div>

</template>
<script type="text/javascript">
  export default {
    name: 'leftTile',
    components: {},
    props: ['left'],
    data () {
      return {
        firstPlayer:false,
        leftTiles:[
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "four_wan_s"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"},
        {url: "standLeft"}
        ],
    }
  },
  // methods: {
  //   begin(){
  //   if(!this.leftTiles){
  //     for(let i = 0; i<13; i++){
  //   this.leftTiles.push({url:'standLeft'})
  // }}}
  }
</script>
<style scoped>
   button {
     display: grid;
     justify-self: center;
     align-self: start;
     background-color: yellow;
   }
   img{
     height: 7vh;
   }
   /* @media screen and (max-width: 400px) {
       img {
         height: 20vh;
       }

   } */

</style>
