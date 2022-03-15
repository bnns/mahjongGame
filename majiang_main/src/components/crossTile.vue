<template>
  <div class="cross">
    <img v-for="tile in crossTiles" 
    :key="tile.index" 
    :class="{active: tile.chiPenGan!==0}"
    :src="require(`../assets/${tile.chiPenGan!==0?tile.url+'.png':'standCross.png'}`)"
    :alt="tile.url"/>
  </div>
</template>
<script type="text/javascript">
//import { mapGetters } from 'vuex'
  export default {
    name: 'CrossTile',
    props: ['cross','crossTiles'],
    data () {
      return {
    }
  },
    watch: {
      crossTiles:{
        handler(val){
          //  if(!val){this.$emit('findMyVal')}
            return val
        }
      }
    }
}
</script>
<style scoped>
.cross{
  display:flex;
  position: relative;
  height: 10vh;
  display:inline-flex;
  flex-wrap: wrap;
  align-content: center;
}
  img{
    height: 5.6vh;
  }
  button{
    border: 0px;
    padding: 0;
    z-index: 12;
  }
   .active{
     justify-self:right;
     height: 9vh;
     padding:2px;
     border-block-color: white;
   }
  @media screen and (max-width: 400px) {
      img {
        height: 5vh;
      }
}
</style>
