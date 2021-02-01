<template>
  <div class="container">
   <!-- <div class="-self" @blur="open = false" v-if="stages === 1"> -->
     <!-- <div class="selected" :class="{ open: open }" @click="open = !open"> -->
       <!-- <img class="image" :src="require(`../assets/${seats[self]}.png`)" /> -->
     <!-- </div> -->
     <!-- <div class="items" :class="{ selectHide: !open }"> -->
       <!-- <div -->
         <!-- id="option" -->
         <!-- v-for="(option, i) of options" -->
         <!-- :key="i" -->
         <!-- @click=" -->
   <!-- //        selected = option; -->
   <!-- //        open = false; -->
   <!-- //        $emit('input', i); -->
   <!-- //      " -->
   <!-- //    > -->
   <!-- //      {{ option }} -->
   <!-- //    </div> -->
   <!-- //  </div> -->
   <!-- //</div> -->

   <!-- //<div class="-right" v-if="stages === 1"> -->
   <!-- //  <img -->
   <!-- //    src="../assets/seats.png" -->
   <!-- //    alt="Direction" -->
   <!-- //    v-on:click="action('North', 1)" -->
   <!-- //    v-show="seats[1]" -->
   <!-- //  /> -->
   <!-- //</div> -->

    <!-- //<div class="-cross" v-if="stages === 1"> -->
    <!-- //  <img -->
    <!-- //    src="../assets/seats.png" -->
    <!-- //    alt="Direction" -->
    <!-- //    v-on:click="action('West', 2)" -->
    <!-- //    v-show="seats[2]" -->
    <!-- //  /> -->
    <!-- //</div> -->

    <!-- //<div class="-left" v-if="stages === 1"> -->
    <!-- //  <img -->
    <!-- //    src="../assets/seats.png" -->
    <!-- //    alt="Direction" -->
    <!-- //    v-on:click="action('South', 3)" -->
    <!-- //    v-show="seats[3]" -->
    <!-- //  /> -->
    <!-- //</div> -->

    <!-- <div class="-center" v-if="stages === 1"> -->
      <!-- {{ guide[index] }} -->
    <!-- </div> -->

    <div id="casting">
      <svg
        class="table"
        width="60vw"
        height="50vh"
        style="background-color:rgb(225, 220, 200)"
      ></svg>
    </div>
  </div>
</template>

<script type="text/javascript">
import io from "socket.io-client";
// import {mapActions} from 'vuex'

export default {
  name: "center",
  props: {
    //seats: {
    //  type: Array,
    //  required: true,
    //  default: ()=>{['seats', 'seats', 'seats','seats']}
    //},
    self: {
      type: Number,
      required: true,
    },
    right: {
      type: Number,
      required: true,
    },
    cross: {
      type: Number,
      required: true,
    },
    left: {
      type: Number,
      required: true,
    },
   // dices: {
   //   type: Number,
   //   required: true,
   // },
    name: {
      type: String,
      required: true,
    },
  //  diceTotal: {
  //    type: Array,
  //    required: true,
  //  },
  //  disabled: {
  //    type: Boolean,
  //    required: true,
  //  },
   //stages: {
   //  type: Number,
   //  required: true,
   //},
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // diceNumber:this.dices,
      selected: null,
      open: false,
      seat: "",
      seatId: 0,
      socket: io("http://192.168.1.76:3000"),
      guide: ["Click dice...", "Dicing...", "Chose seat..."],
      //timing:null,
      seatsObj: [true, true, true, true],
    };
  },

  computed: {
    // diceNumber: function() {
      // return this.dices;
    // },
    // ...mapGetters([
    //   'getDicedNumber'
    // ]),
  },

  methods: {
    // ...mapActions([
    // 'setluckyNumber']),

    //action: function(data) {
      //let data = this.$refs.seats.value;
    //  alert(data);
    //  this.seatsObj.fill(data, this.self);
    //  this.socket.emit("changed", this.seatsObj); //seat selected
    //},

   //myAction: function() {
   //  this.doDicing();
   //},

  // doDicing: function() {
  //   if (this.disabled) {
  //     alert("disabled");
  //     return;
  //   }
  //   let v = this;
  //   let i = 0;
  //   let timing = setInterval(() => {
  //     i++;
  //     let arg = [v.self];
  //     let aGroup = [];
  //     for (let k = 0; k < 4; k++) {
  //       let a = v.getRandomizer(1, 6);
  //       aGroup.push(a);
  //     }
  //     arg.push(aGroup);
  //     //this.diceTotal = aGroup.reduce((accu, el) => accu + el);
  //     this.$emit("change", arg);
  //     // this.socket.emit("diceChange", arg); //emit to Server
  //     // v.setluckyNumber(arg)//talk with data store
  //     if (i > 20) {
  //       clearInterval(timing);
  //       this.$emit("diced", arg);
  //     }
  //   }, 700);
  // },

  // diced() {
  //   this.diceNumber = [];
  //   this.diceNumber = this.dices;
  // },

  // getRandomizer: function(bottom, top) {
  //   let number = Math.floor(Math.random() * (1 + top - bottom)) + bottom;
  //   return number;
  // },

    created() {
      //this.socket.on("luckyNumber", () => {
      //  this.diced();
      //}),
      //  this.socket.on("selected", (data) => {
      //    this.seats.splice(data, 1, false);
      //  }),
        window.console.log("startTiles"); //this.startTiles();??????????????
    },
  },
};
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
  animation: mymove1 3s infinite;
  background-color: gray;
  align-items: center;
}
@keyframes mymove1 {
  from {
    background-color: red;
  }
  to {
    background-color: gray;
  }
}
.-selfN {
  grid-column: 9/-1;
  grid-row: 9/-1;
  background-color: gray;
  align-items: center;
}
.-right {
  grid-column: 9/-1;
  grid-row: 1/9;
  background-color: pink;
  align-items: center;
}
.-cross {
  grid-column: 1/9;
  grid-row: 1/9;
  background-color: rgb(202, 245, 133);
  align-items: center;
}
.-left {
  grid-column: 1/9;
  grid-row: 9/-1;
  background-color: yellow;
  align-items: center;
}
.-center {
  grid-column: 7/11;
  grid-row: 7/11;
  animation: mymove 3s infinite;
  background: darkgreen;
  color: white;
  align-items: center;
  justify-content: center;
}

.selected {
  width: 46px;
  height: 52px;
  color: #fff;
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
.-centerN {
  grid-column: 7/11;
  grid-row: 7/11;
  background: darkgreen;
  color: white;
  align-items: center;
  justify-content: center;
}
.container > div {
  display: flex;
  justify-content: center;
}
</style>
