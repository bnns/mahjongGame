<template>
  <div class="left">
      <img v-for="tile in leftTiles" 
      :key="tile.index" 
      :class="{active: tile.chiPenGan!==0}"
      :src="require(`../assets/${tile.chiPenGan!==0?tile.url+'_s.png':'standLeft.png'}`)"
      :alt="`${tile.url}`"/>
  </div>
</template>
<script type="text/javascript">
//import { mapGetters } from 'vuex';
  export default {
    name: 'LeftTile',
    props: ['left', 'leftTiles'],
    data () {
      return {
    }
  },
  watch:{
    deep: true,
    leftTiles:{
      handler(val){
        //  if(!val){this.$emit('findMyVal')}
        return val
      }
    }
  }
}
</script>
<style scoped>
   .left {
     display: flex;
     flex-direction: column;
     position: relative;
     padding: 0;
     justify-content: center;
     align-items: flex-end;
   }
   img{
     height: 7vh;
   }
   .active{
     padding:2px;
     border-block-color: white;
   }
   /* @media screen and (max-width: 400px) {
       img {
         height: 20vh;
       }

   } */

</style>
