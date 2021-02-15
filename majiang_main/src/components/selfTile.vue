
<script type="text/javascript">
  import {  mapActions } from 'vuex'

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
      seat:'',
      firstPlayer:false,
      //a:this.self,
      counter:0,
      memory:'',
      //tileMemory:{},
      meldedTiles:[]
    }
  },

  methods: {//???move to app
    ...mapActions([
    'tileChosen',
    'updMeldedTile',
    'updPublicTiles1',
    'updTiles',
    ]),
     action(myIndex, tileId){
        if (!this.memory){//click first time
        this.memory = myIndex;//mem the index of the tile
        //this.tileMemory = this.myTiles(this.self)[this.memory]//mem the tile
        return
        }
        this.$emit('casting', [myIndex, tileId, this.memory])
        this.memory = '';
      //  if (this.memory!==myIndex){// second click
      //      if(this.inTurn!==this.myRank){alert('not your turn'); return}
      //  this.$emit('casting', [myIndex, tileId, this.memory])
      //  this.memory = '';
      //  //this.tileMemory = {};
      //  return
      //  }
      //  if (this.memory === myIndex){//already clicked
      // // let temp = []
      //  temp[0] = this.getTiles(this.self)[this.memory];//st
      // //$emit this to app.vue
      //  this.getTiles(this.self).splice(this.memory, 1);//ab
      //  this.updPublicTiles1(this.self);//get a new tile
      // //window.console.log(this.getMyTile.id);
      //  temp[1]=this.self//store the index
      //  this.updMeldedTile(temp);//add one to MeldedTiles
      //  this.memory='';
      //  this.tileMemory={}
      //  return
      //  }
     },
   // action: function (b){
      
      //if (!this.memory){//click first time
      //this.memory = b;//mem the index of the tile
      //this.tileMemory = this.myTiles(this.self)[this.memory]//mem the tile
      //return
      //}
      // if (this.memory!==b){// second click
      //$emit to app.vue
      //this.getTiles(this.self).splice(this.memory, 1);//at same tile?
      //this.getTiles(this.self).splice(b, 0, this.tileMemory);//at another tile
     //this.memory = '';
     //this.tileMemory = {};
     //return
     //}
    //  if (this.memory === myIndex){//already clicked
    // // let temp = []
    //  temp[0] = this.getTiles(this.self)[this.memory];//store the tile 
    // //$emit this to app.vue
    //  this.getTiles(this.self).splice(this.memory, 1);//abandoned
    //  this.updPublicTiles1(this.self);//get a new tile
//
    // //window.console.log(this.getMyTile.id);
    //  temp[1]=this.self//store the index
    //  this.updMeldedTile(temp);//add one to MeldedTiles
    //  this.memory='';
    //  this.tileMemory={}
    //  return
    //  }
    },
    // tileClicked: function (a, id){//a=tile indx, tile id
   
      // let arg = [a, id]
      // this.tileChosen(arg)//!false
    // },
    
    //sortTiles(){alert('sort')
      //this.$emit('sortTiles')
    //},
    // autoArrangeTiles: function(a){
      // this.updTiles(a)//sort tiles
    // }
 }
</script>
<template >
  <div id="selfTiles" >
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
