<template >
  <div class="right">
    <img v-for="tile in rightTiles" 
    :key="tile.index" 
    :src="require(`../assets/${tile.url}.png`)" 
    :alt="`tile.url`"/>
  </div>
</template>
<script type="text/javascript">
//import { mapGetters } from 'vuex'
  export default {
   name: 'RightTile',
   components: {},
   props: ['right', 'rightTiles'],
   data () {
    return {
    }
  },
watch:{
  rightTiles(val, val1){
    return val1
  },
  deep: true
}
  
}    
</script>
<style scoped>
   .right {
     display: flex;
     padding: 0;
     flex-wrap: nowrap;
     flex-direction: column;
     justify-content: space-evenly;
     /* align-items: start; */
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
