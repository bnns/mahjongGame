
<script type="text/javascript">
  //import {  mapActions } from 'vuex'

  export default {
  name: 'selfTile',
  props: {
    self: {
      type: Number,
      required: true,
    },
    inTurn: {
      type: String,
      requred: true,
    },
    myRank: {
      type: String,
      required: true,
    },
    mySeat: {
      type: String,
      required: true,
    },
    myTiles: {
      type: Array,
      required: false,
    }
    }, 
  data(){
    return {
      seat: '',
      firstPlayer: false,
      counter: 0,
      memory: '',
    }
  },

  methods: {
    
    action(myIndex, tileId){
        if (!this.memory){//click first time
        this.memory = myIndex;//mem the index of the tile
        //this.tileMemory = this.myTiles(this.self)[this.memory]//mem the tile
        return
        }
        this.$emit('casting', [myIndex, tileId, this.memory])
        this.memory = '';
     },
   },
 }

</script>

<template>
  <div id="selfTiles">
    <!-- sort tiles -->
    <button @dblclick="$emit('sortTiles', `${self}`)">
           <img v-for = "(tile, index) in myTiles"
             :key = "index"
             :src = "require(`../assets/${tile.url}.png`)"
             :alt = "`${tile.url}`"
             @click = "action(`${index}`, `${tile.id}`)"
             />
             <!-- {{(mySeat===inTurn)?'Yoru Turn':''}} -->
    </button>
  </div>
</template>

 <style scoped>
  img {
    height: 10vh;
  }
  button{
    padding: 15px;
    background: gray;
  }
  @media screen and (max-width: 1200px) {
      img {
        height: 8.2vh;
      }
  }
</style>
