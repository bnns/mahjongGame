<template>
  <div class="right">
    <img
      v-for="tile in rightTiles"
      :key="tile.index"
      :class="{ active: tile.chiPenGan !== 0 }"
      :src="
        require(`../assets/${
          tile.chiPenGan !== 0 ? tile.url + '_s.png' : 'standRight.png'
        }`)
      "
      :alt="tile.url"
    />
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
export default {
  name: "RightTile",
  props: ["right", "rightTiles"],
  data() {
    return {};
  },
   computed: {
    ...mapGetters([
      'getTiles'])},
  watch: {
    deep: true,
    rightTiles: {
      handler(val) {
       return val;
      },
    },
  },
};
</script>
<style scoped>
.right {
  display: flex;
  position: relative;
  padding: 0;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
img {
  height: 7vh;
}
.active {
  padding: 2px;
  border-block-color: white;
}
/* @media screen and (max-width: 500px) {
       img {
         height: 20vh;
       }

   } */
</style>
