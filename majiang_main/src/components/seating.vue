<template>
<div class="container">{{inTurn}}
        <div class="-self" @blur="open=false">
            <div class="selected" :class="{open:open}" @mousemove="open=!open">
              <img class="image" :src="require(`../assets/${seats[self].toLowerCase()}.png`)" />
              <div>{{(inTurn===(users[self].myRank))
                ?" Pick!"
                :`${seats[self].toUpperCase()}`}}</div>
            </div>
            <div class="items" :class="{selectHide:open}"
            v-if='inTurn===(users[self].myRank)'>
                <div
                  id="option"
                  v-for="(option,i) of seatObj"
                  :key="i"
                  @click="
                    selected=option;
                    open=false;
                    $emit('input', i);
                  ">
                  {{option}}
                </div>
            </div> 
            <div class="name">{{users[self].name}}{{inTurn}}</div>
        </div>
      <div class="-right">
        <img
          :src="require(`../assets/${seats[right].toLowerCase()}.png`)"
          alt="Direction"
        />
        <div>{{(inTurn===(users[right].myRank))
          ?" Pick!"
          :`${seats[right].toUpperCase()}`}}</div>
        <div class="name">{{users[right].name}}</div>
      </div>
      <div class="-cross">
        <img
          :src="require(`../assets/${seats[cross].toLowerCase()}.png`)"
          alt="Direction"
        />
        <div>{{(inTurn===(users[cross].myRank))
          ?" Pick!"
          :`${seats[cross].toUpperCase()}`}}</div>
        <div class="name">{{users[cross].name}}</div>
      </div>
      <div class="-left">
        <img
          :src="require(`../assets/${seats[left].toLowerCase()}.png`)"
          alt="Direction"
        />
        <div>{{(inTurn===(users[left].myRank))
          ?" Pick!"
          :`${seats[left].toUpperCase()}`}}</div>
        <div class="name">{{users[left].name}}</div>
      </div>
      <div class="-center">
        {{ guide[index] }}
      </div>
    </div>
</template>

<script type="text/javascript">
export default {
  name: "Seating",
  props: {
    seatObj:{
      type: Array,
      required: true,
    },
    seats:{
      type: Array,
      required: true,
    },
    self:{
      type: Number,
      required: true,
    },
    right:{
      type: Number,
      required: true,
    },
    cross:{
      type: Number,
      required: true,
    },
    left:{
      type: Number,
      required: true,
    },
    name:{
      type: String,
      required: true,
    },
    index:{
      type: Number,
      required: true,
    },
    inTurn:{
      type: String,
      required: false,
    },
    myRank:{
      type: String,
      required: true,
    },
    users:{
      type: Array,
      require: true,
    },
    rank:{
      type: Array,
      required: true,
    }
  },
  data(){
    return{
      selected:null,
      open:false,
      guide: [ "Pick seat..."],
    };
  },

   watch: {
   seats: function(newVal) {
     return newVal;
   },
   deep:true
   },

   methods: {
     action: function(data) {
       this.seatsObj.fill(data, this.self);
       this.socket.emit("changed", this.seatsObj); //seat selected
     },
   },
  // created() {
  //     this.sortedRank = this.mySort(this.rank)
  //    //  this.socket.on("selected", (data) => {
  //      //  this.seats.splice(data, 1, false);
  //    //  }),
  //     window.console.log("startTiles"); //this.startTiles();??????????????
  // },
}
</script>

<style scoped>
img {
  max-height: 58px;
}
.container {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
  height: 85vh;
  width: 90vw;
  align-self: center;
}
.-self {
  grid-column: 9/-1;
  grid-row: 9/-1;
  display:flex;
  position:relative;
  flex-flow: column;
  animation: mymove1 3s infinite;
  background-color: gray;
  align-items: center;
  justify-items: center;
}
.-self .name{
  /* display: flex; */
  position: absolute;
  right:2px;
  bottom:2px;
  border-radius: 3px;
  background-color: rgb(255, 153, 20);
}
@keyframes mymove1 {
  from {
    background-color: red;
  }
  to {
    background-color: gray;
  }
}
/* .-selfN { */
  /* grid-column: 9/-1; */
  /* grid-row: 9/-1; */
  /* background-color: gray; */
  /* align-items: center; */
/* } */
.-right {
  display:flex;
  position: relative;
  grid-column: 9/-1;
  grid-row: 1/9;
  /* display: inline-block; */
  background-color: pink;
  align-items: center;
  flex-flow: column;
}
.-right .name{
  position: absolute;
  right:2px;
  top:2px;
  writing-mode: vertical-rl;
  text-orientation: sideways;
  transform: rotate(180deg);
  border-radius: 3px;
  background-color: rgb(255, 153, 20);
}
.-cross {
  display:flex;
  position: relative;
  grid-column: 1/9;
  grid-row: 1/9;
  background-color: rgb(202, 245, 133);
  align-items: center;
  flex-flow: column;
}
.-cross .name{
  position: absolute;
  left:2px;
  top:2px;
  border-radius: 3px;
  background-color: rgb(255, 153, 20);
}
.-left {
  position: relative;
  grid-column: 1/9;
  grid-row: 9/-1;
  background-color: yellow;
  align-items: center;
  display:flex;
  flex-flow: column;
}
.-left .name{
  position: absolute;
  left:2px;
  bottom:2px; 
  writing-mode: vertical-rl;
  text-orientation: sideways;
  border-radius: 3px;
  background-color: rgb(255, 153, 20);
}
.-center {
  grid-column: 7/11;
  grid-row: 7/11;
  animation: mymove 3s infinite;
  background: darkgreen;
  color: white;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  z-index: 9;
  opacity: 0.8;
}

.selected {
  display:grid;
  justify-items: center;
  align-content: center;
  width: 46px;
  height: 52px;
  color: rgb(8, 243, 59);
  cursor: pointer;
}

.items {
  border-radius: 0px 0px 6px 6px;
  overflow: hidden;
  background-color: #7e76ee;
  z-index: 1;
}

.items #option {
  padding-left: 1em;
  padding-right: 1em;
  cursor: pointer;
}

#option:hover {
  background-color: #98c911;
}

.selectHide {
  display: none;
}
@keyframes mymove {
  from {
    background-color: yellow;
  }
  to {
    background-color: red;
  }
}

.image>img:hover{
    color:black !important;
animation: shake 0.5s;
animation-iteration-count: infinite;
}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
} 
/* .-centerN { */
  /* grid-column: 7/11; */
  /* grid-row: 7/11; */
  /* background: darkgreen; */
  /* color: white; */
  /* align-items: center; */
  /* justify-content: center; */
/* } */
/*  */
/* .showL { */
/* grid-row: 12/12; */
/* grid-column: 14/14; */
/* } */

.container > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
