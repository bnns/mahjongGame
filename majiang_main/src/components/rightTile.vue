<template >
  <div class="right">
    <button>
    <img v-for="tile in rightTiles" :key="tile.index" :src="require(`../assets/${tile.url}.png`)" :alt="`${tile.url}`"/>
    </button>
  </div>
</template>
<script type="text/javascript">
  export default {
  name: 'rightTile',
  components: {},
  props: ['right'],
  data () {
    return {
          firstPlayer:false,
          rightTiles:
          [
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "standRight"},
          {url: "seven_tiao_s"}
          ],
      }
    }
}
</script>
<style scoped>
   button {
     display: flex;
     flex-wrap: nowrap;
     flex-direction: column;
     justify-content: space-evenly;

     align-items: flex-end;
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
