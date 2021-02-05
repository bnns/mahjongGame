
<script type="text/javascript">
  import { mapGetters, mapActions } from 'vuex'

  export default {
  name: 'selfTile',
  props: ['self'],
  data(){
    return {
      seat:'',
      firstPlayer:false,
      //a:this.self,
      counter:0,
      memory:'',
      tileMemory:{},
      meldedTiles:[]
    }
  },
  computed: {  
    ...mapGetters ([
   'getTiles'
    ]),
    myTiles: function(){
      return this.getTiles(this.self)
    },
  },

  methods: {
    ...mapActions([
    'tileChosen',
    'updMeldedTile',
    'updPublicTiles1',
    'updTiles',
    ]),
    action: function (b){
      if (!this.memory){//click first time
      this.memory = b;//mem the index of the tile
      this.tileMemory = this.getTiles(this.self)[this.memory]//mem the tile
      return
      }
      if (this.memory!==b){// second click
      this.getTiles(this.self).splice(this.memory, 1);//at same tile?
      this.getTiles(this.self).splice(b, 0, this.tileMemory);//at another tile
      this.memory = '';
      this.tileMemory = {};
      return
      }
      if (this.memory === b){//already clicked
        let temp = []
      temp[0] = this.getTiles(this.self)[this.memory];//store the tile 
      this.getTiles(this.self).splice(this.memory, 1);//abandoned
      this.updPublicTiles1(this.self);//get a new tile

      // window.console.log(this.getMyTile.id);
      temp[1]=this.self//store the index
      this.updMeldedTile(temp);//add one to MeldedTiles
      this.memory='';
      this.tileMemory={}
      return
      }
    },
    tileClicked: function (a, id){//a=tile indx, id tile group indx
      let arg = [a, id]
      this.tileChosen(arg)//!false
    },
    autoArrangeTiles: function(a){
      this.updTiles(a)//sort tiles
    }
 },
}

</script>
<template >
  <div id="myTiles" >
    <!-- sort tiles -->
    <button @dblclick = "autoArrangeTiles(`${self}`)">
      <img v-for = "(tile, index) in myTiles"
        :key = "index"
        :src = "require(`../assets/${tile.url}.png`)"
        :alt = "`${tile.url}`"
        v-on:click = "action(`${index}`); tileClicked(`${self}`,`${tile.id}`)"
        />
    </button>
  </div>
</template>
 <style scoped>
  img {
    height: 11vh;
  }
  button{
    padding: 15px;
    background: gray;
  }
  @media screen and (max-width: 1200px) {
      img {
        height: 8vh;
      }
  }
</style>
