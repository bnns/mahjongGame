<template>
  <div class="cross">
    <button>
    <img v-for="tile in crossTiles" 
    :key="tile.index" 
    :src="require(`../assets/${tile.url}.png`)" 
    :alt="`tile.url`"/>
    </button>
  </div>

</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
  export default {
    name: 'crossTile',
    components: {},
    props: ['cross'],
    data () {
      return {
    }
  },

  computed: {  
  ...mapGetters ([
 'getTiles'
  ]),
  
  crossTiles: {
    cache: false,
    get() {
    let a = this.getTiles(this.cross)
    a.forEach(e => (e.chiPenGan)
    ?e.url = `${e.url}_s`
    :e.url = 'standCross')
    return a
    },
  },
},
}
</script>
<style scoped>
  img{
    height: 6vh;
  }
  button{
    border: 0px;
    padding: 8px;
    background-color: blue;
    z-index: 12;
  }
  @media screen and (max-width: 1200px) {
      img {
        height: 4vh;
      }
}
</style>
