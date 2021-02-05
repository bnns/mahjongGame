<template>
  <div class="left">
    <button>
      <img v-for="tile in leftTiles" 
      :key="tile.index" 
      :src="require(`../assets/${tile.url}.png`)" 
      :alt="`tile.url`"/>
    </button>
  </div>

</template>
<script type="text/javascript">
import { mapGetters } from 'vuex';
  export default {
    name: 'leftTile',
    components: {},
    props: ['left'],
    data () {
      return {
    }
  },

  computed: {
     ...mapGetters ([
    'getTiles'
    ]),

    leftTiles: {
      cache: false,
      get() {
      let a = this.getTiles(this.left)
      a.forEach((e) => (e.chiPenGan)
      ?e.url = `${e.url}_s`
      :e.url = 'standLeft')
      return a
      },
    },
  },
}
</script>
<style scoped>
   button {
     display: flex;
     flex-direction: column;
     padding: 18px;
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
