<template>
  <div class="cross">
    <img v-for="tile in crossTiles" 
    :key="tile.index" 
    :src="require(`../assets/${tile.url}.png`)" 
    :alt="tile.url"/>
  </div>
</template>
<script type="text/javascript">
//import { mapGetters } from 'vuex'
  export default {
    name: 'CrossTile',
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
.cross{
  height: 10vh;
  display:inline-flex;
  flex-wrap: wrap;
  align-content: center;
}
  img{
    height: 5.5vh;
  }
  button{
    border: 0px;
    padding: 0;
    z-index: 12;
  }
  @media screen and (max-width: 400px) {
      img {
        height: 4vh;
      }
}
</style>
