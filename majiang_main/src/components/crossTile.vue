<template>
  <div class="cross">
    <button>
    <img v-for="tile in crossTiles" 
    :key="tile.index" 
    :src="require(`../assets/${tile.url}.png`)" 
    :alt="tile.url"/>
    </button>
  </div>

</template>
<script type="text/javascript">
//import { mapGetters } from 'vuex'
  export default {
    name: 'crossTile',
    components: {},
    props: ['cross','crossTiles'],
    data () {
      return {
    }
  },

//  computed: {  
//  ...mapGetters ([
// 'getTiles'
//  ]),
//  crossTiles: {
//    cache: false,
//    get() {
//      if(this.stages!=='mahjiong'){return}
//    let a = this.getTiles(this.cross)
//    a.forEach(e => (e.chiPenGan)
//    ?e.url = `${e.url}_s`
//    :e.url = 'standCross')
//    return a
//    },
//  },
//},
//watch: {
//    crossTiles: (newCount, oldCount)=>{
//      if(oldCount!==newCount){
//      return newCount
//    }}
//  }
}
</script>
<style scoped>
  img{
    height: 5.5vh;
  }
  button{
    border: 0px;
    padding: 8px;
    background-color: blue;
    z-index: 12;
  }
  @media screen and (max-width: 400px) {
      img {
        height: 4vh;
      }
}
</style>
