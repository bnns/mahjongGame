<template>
  <div class="container">
    <div class="-self" v-on:click="myAction(`${self}`)">
      <div>
        <img
          :src="require(`../assets/${diceNumber[self][0]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[self][1]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[self][2]}.png`)"
          alt="Image lost..."
        />
      </div>

      <div>
        <img
          :src="require(`../assets/${diceNumber[self][3]}.png`)"
          alt="Image lost..."
        />
      </div>
      <h3>{{ this.diceTotal[self] }}</h3>
    </div>
    <div class="-right">
      <div>
        <img
          :src="require(`../assets/${diceNumber[right][0]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[right][1]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[right][2]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[right][3]}.png`)"
          alt="Image lost..."
        />
      </div>
      <h3>{{ this.diceTotal[right] }}</h3>
    </div>
    <div class="-cross">
      <div>
        <img
          :src="require(`../assets/${diceNumber[cross][0]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[cross][1]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[cross][2]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[cross][3]}.png`)"
          alt="Image lost..."
        />
      </div>
      <h3>{{ this.diceTotal[cross] }}</h3>
    </div>
    <div class="-left">
      <div>
        <img
          :src="require(`../assets/${diceNumber[left][0]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[left][1]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[left][2]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div>
        <img
          :src="require(`../assets/${diceNumber[left][3]}.png`)"
          alt="Image lost..."
        />
      </div>
      <h3>{{ this.diceTotal[left] }}</h3>
    </div>
     <div class="-center">
   {{guide[index]}}
 </div>
  </div>
</template>

<script type="text/javascript">
//import io from "socket.io-client";
// import {mapActions} from 'vuex'

export default {
  name: "dicing",
  props: {
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
    dices: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    diceTotal: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    stages: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // diceNumber:this.dices,
      guideIndex: this.index,
      selected: null,
      open: false,
      seat: "",
      seatId: 0,
      //socket: io("http://192.168.1.76:3000"),
      guide: ["Dice here...", "Dicing...", "Pick seat..."],
      //timing:null,
    };
  },

  computed: {
    diceNumber: function() {
      return this.dices;
    },
  },

  methods: {
    myAction: function() {
        this.doDicing();
    },

    doDicing: function() {
      if (this.disabled) {
        alert("disabled");
        return;
      }
      let v = this;
      let i = 0;
      let timing = setInterval(() => {
        i++;
        let arg = [v.self];
        let aGroup = [];
        for (let k = 0; k < 4; k++) {
          let a = v.getRandomizer(1, 6);
          aGroup.push(a);
        }
        arg.push(aGroup);
        //this.diceTotal = aGroup.reduce((accu, el) => accu + el);
        this.$emit("change", arg);
        // this.socket.emit("diceChange", arg); //emit to Server
        // v.setluckyNumber(arg)//talk with data store
        if (i > 20) {
          clearInterval(timing);
          this.$emit("diced", arg);
        }
      }, 700);
      
    },

    diced() {
      this.diceNumber = [];
      this.diceNumber = this.dices;
    },

    getRandomizer: function(bottom, top) {
      let number = Math.floor(Math.random() * (1 + top - bottom)) + bottom;
      return number;
    },
  },
  // created() {
  // window.console.log("startTiles"); //this.startTiles();??????????????
  // },
};
</script>

<style scoped>
* {
  top: 0;
  left: 0;
}
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
.-self:hover{
    cursor: pointer;
}
.container > div {
  display: flex;
  justify-content: center;
}
</style>
