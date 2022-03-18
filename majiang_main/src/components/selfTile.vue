<script type="text/javascript">
import { mapActions } from "vuex";

export default {
  name: "SelfTile",
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
      default: function() {
        return [{ url: "east_wind" }];
      },
      required: false,
    },
  },
  data() {
    return {
      clicked: null,
      memory:null,
      seat: "",
      firstPlayer: false,
      counter: 0,
      taken:"item1",
      chowArray:null,
      pengArray:null,
      kongArray:null,
      tiles:null,
      rest:this.myTiles,
    };
  },
  updated (){
    if(this.myTiles){
      this.tiles=this.myTiles}
  },
  //   this.chowArray=[],this.pengArray=[],this.kongArray=[],this.rest=[]
  //     if(!this.myTiles){return}
  //       this.myTiles.map(e => {
  //         e.chiPenGan===1
  //         ?this.chowArray.push(e)
  //         :e.chiPenGan===2
  //         ?this.pengArray.push(e)
  //         :e.chiPenGan===3
  //         ?this.kongArray.push(e)
  //         :this.rest.push(e)
  //       });
  //       let a=[this.chowArray, this.pengArray, this.kongArray, this.rest]
  //       this.tiles=a.filter(e=>e.length!==0)
  // },
  methods: {
    ...mapActions(["updMyTiles"]),
    action(myIndex, tile) {
      this.clicked=[myIndex, tile]
      if (!this.memory) {
        //click first time
        this.memory = [myIndex, tile]; //mem the index of the tile
        return;
      } else {
        this.$emit("casting", [
          this.memory,
          this.clicked,
        ]);
        this.memory = null;
        this.clicked = null;
      }
    },
    sorting() {
      this.$emit("sorting", this.self);
    },
    // this.updMyTiles(["sorting", this.self])}
  },
};
</script>
<template>
  <div id="selfTiles">
     <div class="tiles" v-for="(tile, index) in tiles" 
       :key="index">
      <img
        class="float"
        :class = "{ active: clicked === index,
         'taken': tile.chiPenGan !==0,
          'fallDown': tile.chosen}"
        :src="require(`../assets/${tile.url}.png`)"
        :alt="tile.url"
        @click="tile.chiPenGan==0?action(index, tile):''"
      />
    </div>
    <button class="sorting" @click="sorting()">
      <p class="tileTotal">{{ myTiles.length }}</p>
    </button>
  </div>
</template>

<style scoped>
.tiles {
  display: inline-flex;
  border-left: 2px solid black;
}
.active {
  transform: rotate(45deg);
}
img {
  height: 9vh;
}
button {
  display: inline-flex;
  position: relative;
  width: 9vh;
  height: 9vh;
  margin-left: 1rem;
  border: 0px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgb(252, 180, 180) 0%,
    rgb(185, 9, 9) 70%,
    rgb(198, 4, 9) 28%,
    rgb(32, 3, 2) 100%
  );
  box-shadow: -2px -1px 0 rgb(185, 15, 115);
  transition: all 0.2s ease-in-out;
}
.tileTotal {
  position: absolute;
  color: white;
  padding: 0;
  margin: auto;
  right: 45%;
}
.sorting::before {
  position: absolute;
  content: "sort";
  color: black;
  top: 35%;
  right: 35%;
}
button:hover {
  filter: brightness(160%);
  transform: scale(1.1);
  box-shadow: -5px -4px 20px rgb(235, 117, 117);
}
.float {
  border-radius: 5px;
  box-shadow: 3px 3px 7px whitesmoke;
}
.float:hover {
  transform: rotate(10deg);
  box-shadow: 4px 4px 10px rgba(200, 200, 200, 0.7);
}
.taken{
   border: 3px solid darkcyan;
   filter: brightness(80%);
}
.taken::after{
  content: "peng";
}
.fallDown{
  transform:rotate(90deg)
}
@media screen and (max-width: 400px) {
  img {
    height: 10vh;
  }
}
</style>
