<template class="box">
    <div id="app" class="container">
        <div class="self" v-show="show">
    <selfTile :self='self'
              :tilesOnHands='tilesOnHands'/>
        </div>
        <div class="cross" v-show="show">
      <crossTile v-bind:cross="cross" />
        </div>
        <div class="left" v-show="show">
      <leftTile v-bind:left="left" />
        </div>
        <div class="right" v-show="show">
      <rightTile v-bind:right="right" />
        </div>

        <div class="center" v-show="show">
      <viewMelded
        :self="self"
        :right="right"
        :left="left"
        :cross="cross"
        :name="name"
      />
        </div>

        <div class='center' v-if="stages==='dicing'">
            <dicing
               :self="self"
               :right="right"
               :left="left"
               :cross="cross"
               :index='index'
               :name="name"
               :stages="stages"
               :dices="dices"
               :diceTotal="diceTotal"
               :disabled="disabled"
               @change="change"
               @diced="diced"
             />
        </div>

        <div class="center" v-if="stages==='seating'">
             <seating
               :self="self"
               :right="right"
               :left="left"
               :cross="cross"
               :name="name"
               :seats="seats"
               :index="index"
               :seatObj="seatObj"
               @input="selected"
               :myTurn="myTurn"
               :rank="rank"
               :myRank="myRank"
             />
        </div>

        <!-- <div class="self" v-if="stages==='mahjiong'"> -->
      <!-- <selfTile v-bind:self="self" /> -->
        <!-- </div> -->
        <div class="center" v-if="stages==='login'">
            <login
               @clicked="finishOnLogin"
               :counter="counter"
               :name="name"
               :roomId="roomNumb"
               :mySocketId="mySocketId"
            />
        </div>
    </div>
</template>

<script>
import io from "socket.io-client";
import { mapGetters, mapActions } from "vuex";
import selfTile from "./components/selfTile.vue";
import crossTile from "./components/crossTile.vue";
import leftTile from "./components/leftTile.vue";
import rightTile from "./components/rightTile.vue";
// import center from "./components/center.vue";
import viewMelded from "./components/viewMelded.vue";
import login from "./components/login.vue";
import dicing from "./components/dicing.vue";
import seating from "./components/seating.vue";
//import videoChat from './components/videoChat.vue'
export default {
  name: "app",
  components: {
    selfTile,
    // center,
    login,
    crossTile,
    leftTile,
    rightTile,
    viewMelded,
    dicing,
    seating,
    // videoChat
  },
  data() {
    return {
      socket: io("http://192.168.1.76:3000"),
      name: "John",
      dices: [],
      stages: '',
      index: 0,
      roomNumb: null,
      dice: [
        "one_point",
        "two_points",
        "three_points",
        "four_points",
        "five_points",
        "six_points",
      ],
      options: ["North北", "East. 東", "West 西", "South南"],
      mySocketId: "",
      myTurn: 'last',
      myRank: '',
      duplicated: false,
      disabled: false,
      wasConnected: false,
      diceTotal: [],
      users: [],
      self: 0,
      right: 1,
      cross: 2,
      left: 3,
      mySeat:'',
      myId:'',
      inOrder: ['first', 'second', 'third', 'last'],
      seats: ["seats", "seats", "seats", "seats"],
      seatsObject: ["NORTH", "EAST", "WEST" ,"SOUTH"],
      seatObj:this.options,
      counter: 0,
      rank:[],
      show: false,
      flag: false,
      temp: [],
    };
  },

  created() {
    let a = this.getDicedNumber; // from store
    this.goTotal(a);

    //need to use roomId for communication!
    this.socket.on("loggedIn", data => {
      if(!this.wasConnected){
        this.wasConnected=true
        this.stages = 'login'}
      (this.users.length===0)
      ?(this.roomNumb = data[data.length-1].roomId, 
       this.myId = data[data.length-1].userId)
      :window.console.log(this.roomNumb);
      if(this.counter<5)//reconnect?
      {
        this.mySocketId = this.socket.id;
        this.counter = data.length;
      }
     });

     this.socket.on('ping', ()=>
    { 
      let payload=[];
      {
       let lastId = this.mySocketId;
       this.mySocketId = this.socket.id;
       
       payload.push({
       roomId: this.roomNumb,
       lastId: lastId,
       userId: this.myId,
       id:this.mySocketId,
       });
       
       //this.socket.emit("reconnect", payload);
      }
      this.socket.emit('pong', payload);
      //socket.emit('pong', {beat: 1});
    });

    this.socket.on("userOnline", (data) => {
      // user registed online from server
      this.users.push(data);
    });

    // from server to all 4 apps
    this.socket.on("luckyNumber", (data) => {

      this.setluckyNumber(data); //mutates store (unity 4 stores)
      this.goTotal(this.getDicedNumber);
    });

    this.socket.on("dup", (dup) => {
      dup.some((e) => {
        e.index === this.self
          ? this.disabled = false//emit to counter 
          : window.console.log("me no dup");
      });
    });

    //from server//data???data.n
    this.socket.on("allDiced", data => {
      let byTotal = data.sort((a, b)=>b.t-a.t);
  
      this.rank = this.award(byTotal);
      this.rank = this.rank.sort((a, b)=>a.a-b.a)
      //window.console.log(data.map(d => d.t).sort((a, b)=>b-a))
      this.rank.forEach((e, idx) => {
        e.a === this.self
          ? this.findMyRank(idx)
          : window.console.log("no rank?");
          this.myTurn="first";
         if(this.myRank==="first"){
            this.users[this.self].dealer=true;
         }
         this.seatObj = this.options;//set for seating
      });
      setTimeout( 
        ((this.index = 0), //instru guide
        (this.stages = 'seating')),
        6000
      );
    });

    this.socket.on('selected', data => {
    this.seats = data[0][0];
    this.seatsObject = data[0][1];
    this.seatObj = data[0][2];
    window.console.log(data, 'seatSelect')
    this.myTurn = this.inOrder[data[1]];
    });

    //all seats selected
    this.socket.on("sitDown", () => {
       let payload = this.users[this.self];
       ['SOUTH', 'EAST', 'NORTH', 'WEST']
       .filter((e, i)=>{if(e===this.mySeat) 
            {
         this.users[this.self].seat = this.mySeat, 
         this.pagePosition(i)}
        
            })
        this.socket.emit('ready', [payload, this.self])
        this.show = true;
        this.stages = 'mahjiong'
    });
    
    this.socket.on('userSet', data => {
      this.temp.push(data)
      if(this.temp.length === 4){
      this.setPlayers(this.temp[3])
      this.socket.emit('makeWalls', data)
      }
    });

    //ready to play...
    this.socket.on('setTiles', data => {
      this.startTiles(data)
    });

    this.socket.on("loggedOut", (data) => {
      window.console.log(`${data} left! `); //when somebody logged out
    });
    
    //all four players logged-in
    this.socket.on("Full", users => {
      this.counter = 0;
      this.users = users;
      this.stages = 'dicing';
    });
  },

  computed: {
    ...mapGetters([
      'getPlayers',
      "getDicedNumber",
    ]),
  },

  methods: {
    ...mapActions(["setluckyNumber",
                   "startTiles",
                   "setPlayers"]),

    //after seat selected from 'seating'
    selected: function(data){ 
     if(this.myTurn!=='last'){
     this.inOrder.forEach((e, i)=>{
         (e===this.myTurn)
         ?(this.myTurn = e[i+1], window.console.log(e[i+1],'myTurn'))//next turn
         :window.console.log('')
     });
     }
      let selectedIndex = data;//index selected in seating.vue
      let a = this.seatsObject[selectedIndex];//find the tile
      this.seats.splice(this.self, 1, a);//replace [seats]
      this.mySeat = a.replace(/B/, '').toUpperCase();
      this.seatsObject.splice(selectedIndex, 1);//del the tile
      this.seatObj.splice(selectedIndex, 1);//del the name
      let payload = [this.seats, this.seatsObject, this.seatObj]
      this.socket.emit('seatSelected', payload);  
    },

    //$emit when dicing
    // notify other apps
    change: function(data) {
      this.index = 1;
      this.socket.emit("diceChange", data);
    },
    //this.dices.splice(data[0], 1, this.dice[data[1] - 1]);

    pagePosition: function(data) {
      this.self = data;
      this.right = this.self + 1;
      if (this.right > 3) {
        this.right = 0;
      }
      this.cross = this.right + 1;
      if (this.cross > 3) {
        this.cross = 0;
      }
      this.left = this.cross + 1;
      if (this.left > 3) {
        this.left = 0;
      }
    },

    finishOnLogin: function(user) {
      this.name = user.name;
      this.pagePosition(user.index);
      this.socket.emit("newuser", user);
    },
    
     //from dicing $emit when finished
    diced: function(data) {
      let a = data[0];
      let b = data[1].reduce((ac, e) => ac + e);
      let payload = { a: a, t: b }; //a index, t total
      this.disabled = true;
      this.socket.emit("diced", payload);
    },

    goTotal: function(data){
    let a1 = [],
      a2 = new Array(4);
    for (let i = 0; i < 4; i++) {
      for (let k = 0; k < 4; k++) {
        a1[k] = this.dice[data[i][k] - 1];
        }
      a2[i] = a1;
      a1 = [];
      this.diceTotal[i] = data[i].reduce((t, e) => t + e);
      }
      this.dices = a2;
    },

    findMyRank: function(rank) {
      switch (rank) {
        case 0:
          this.myRank = "first";
          break;
        case 1:
          this.myRank = "second";
          break;
        case 2:
          this.myRank = "third";
          break;
        case 3:
          this.myRank = "last";
      }
      return this.myRank;
    },

    award: function (rank){
      let a = ['first', 'second', 'third', 'last'];
      for(let i = 0; i < 4; i++){
        rank[i].n = a[i]
      }
      return rank
    },
    
  },
};
</script>
<style>
.cross {
  grid-area: cross;
  justify-self: center;
  align-self: start;
}
.left {
  grid-area: left;
  justify-self: center;
  align-self: start;
  z-index: 1;
  /* height: 100vh;
         width: 10vh; */
  /* to limit the size can also defined in other div. */
}
.right {
  grid-area: right;
  justify-self: center;
  align-self: start;
  z-index: 1;
  /* height: 100vh;
           width: 10vh; */
}
.center {
  font-size: max(2vw, 20px);
  grid-area: center;
  justify-self: center;
  align-self: start;
  /* align-items: stretch; */
}
.self {
  grid-area: self;
  justify-self: center;
  align-self: start;
}

 .container {
  display: grid;
  font-size: 1.5rem;
  grid-template-columns:  1fr ;
  grid-template-rows: 1fr;
  grid-template-areas:
    "left cross right"
    "left center right"
    "left self right";
  background-color: rgba(rgb(243, 171, 171), rgb(239, 245, 239), rgb(212, 212, 231), 0.4)
}

@media screen and (max-width: 400px) {
  .container {
    grid-template-columns: 40px 1fr 40px;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas:
      "cross cross cross"
      "left center right"
      "self self self";
  }
}
</style>
