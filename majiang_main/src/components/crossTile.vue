<template>
  <div class="cross">
    <button>
    <img v-for="tile in crossTiles" :key="tile.index" :src="require(`../assets/${tile.url}.png`)" :alt="`tile.url`"/>
    </button>
  </div>
</template>
<script type="text/javascript">

  export default {
    name: 'crossTile',
    components: {},
    props: ['cross'],
    data () {
      return {
        firstPlayer:false,
        crossTiles:
        [
        {url: "standCross"},
        {url: "standCross"},
        {url: "standCross"},
        {url: "standCross"},
        {url: "seven_tiao_s"},
        {url: "standCross"},
        {url: "standCross"},
      {url: "standCross"},
      {url: "standCross"},
      {url: "standCross"},
      {url: "standCross"},
      {url: "standCross"},
      {url: "standCross"}
        ],
    }
  }
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
  @media screen and (max-width: 600px) {
      img {
        height: 5vh;
      }
}
</style>
