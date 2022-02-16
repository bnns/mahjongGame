<template>
  <div class="left">
   
      <img v-for="tile in leftTiles" 
      :key="tile.index" 
      :src="require(`../assets/${tile.url}.png`)" 
      :alt="`tile.url`"/>
    
  </div>

</template>
<script type="text/javascript">
//import { mapGetters } from 'vuex';
  export default {
    name: 'LeftTile',
    components: {},
    props: ['left', 'leftTiles'],
    data () {
      return {
    }
  },

  // computed: {
    //  ...mapGetters ([
    // 'getTiles'
    // ]),

    // leftTiles: {
     // cache: false,
      // get() {
      // let a = this.getTiles(this.left)
      // if(a){
      // a.map((e) => (e.chiPenGan)
      // ?(e.url = `${e.url}`)
      // :e.url = 'standLeft')
      // }
      // return a
      // },
    // },
  //},
}
</script>
<style scoped>
   .left {
     display: flex;
     flex-direction: column;
     padding: 0;
     justify-self: center;
     align-self: start;
     margin: auto auto;
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
