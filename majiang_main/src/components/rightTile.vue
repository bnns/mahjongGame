<template >
  <div class="right">
    <button>
    <img v-for="tile in rightTiles" 
    :key="tile.index" 
    :src="require(`../assets/${tile.url}.png`)" 
    :alt="`tile.url`"/>
    </button>
  </div>

</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
  export default {
   name: 'rightTile',
   components: {},
   props: ['right'],
   data () {
    return {
    }
  },

    computed: {  
    ...mapGetters ([
   'getTiles'
    ]),

    rightTiles: {
      cache: false,
      get() {
      let a = this.getTiles(this.right)
      a.forEach(e => (e.chiPenGan)
      ?e.url=`${e.url}_s`
      :e.url = "standRight")
      return a
      },
    },
  },
}    
</script>
<style scoped>
   button {
     display: flex;
     flex-wrap: nowrap;
     flex-direction: column;
     justify-content: space-evenly;
     padding: 18px;
     /* align-items: start; */
     background-color: pink;
   }
   img{
      height: 7vh;
   }
   /* @media screen and (max-width: 500px) {
       img {
         height: 20vh;
       }

   } */

</style>
