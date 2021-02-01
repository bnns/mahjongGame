
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
      if (!this.memory){
      this.memory = b;
      this.tileMemory = this.getTiles(this.self)[this.memory]
      return
    }
      if (this.memory!==b){
      this.getTiles(this.self).splice(this.memory, 1);
      this.getTiles(this.self).splice(b, 0, this.tileMemory);
      this.memory = '';
      this.tileMemory = {};
      return
    }
      if (this.memory === b){
        let temp = []
      temp[0] = this.getTiles(this.self)[this.memory];
      this.getTiles(this.self).splice(this.memory, 1);
      this.updPublicTiles1(this.self);

      // window.console.log(this.getMyTile.id);
      temp[1]=this.self
      this.updMeldedTile(temp);
      this.memory='';
      this.tileMemory={}
      return
    }
  },
    tileClicked: function (a, id){
      let arg = [a, id]
      this.tileChosen(arg)
    },
    autoArrangeTiles: function(a){
      this.updTiles(a)
    }
},
}

</script>
<template >
  <div id="myTiles" >
    <button @dblclick = "autoArrangeTiles(`${self}`)">
      <img v-for="(tile, index) in myTiles"
        :key="index"
        :src="require(`../assets/${tile.url}.png`)"
        :alt="`${tile.url}`"
        v-on:click = "action(`${index}`); tileClicked(`${self}`,`${tile.id}`)"
        />
    </button>{{self}}
  </div>
</template>
 <style scoped>
  img {
    height: 15vh;
  }
  button{
    padding: 5px;
    background: gray;
  }
  @media screen and (max-width: 600px) {
      img {
        height: 15vh;
      }
  }
</style>
