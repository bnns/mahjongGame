<template class="box">
    <div id="app" class="container">
        <div class="self" v-show="show">
    <selfTile :self='self'
              :myTiles='myTiles'
              :inTurn='inTurn'
              :mySeat='mySeat'
              :myRank='myRank'
              @sortTiles='sortTiles'
              @casting='casting' />
        </div>
        <div class="cross" v-show="show">
      <crossTile :cross="cross"
                 :crossTiles="crossTiles"/>
        </div>
        <div class="left" v-show="show">
      <leftTile :left="left"
                :leftTiles='leftTiles'/>
        </div>
        <div class="right" v-show="show">
      <rightTile :right="right"
                 :rightTiles="rightTiles" />
        </div>

        <div class="center" v-show="show">
      <viewDiscarded
        :self="self"
        :right="right"
        :left="left"
        :cross="cross"
        :users="users"
        :goAhead='goAhead'
        @getTile="getTile"
        :tilesOnTableLength="tilesOnTableLength"
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
               :users="users"
               :seats="seats"
               :index="index"
               :seatObj="seatObj"
               @input="selected"
               :inTurn="inTurn"
               :rank="rank"
               :myRank="myRank"
             />
        </div>

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
//import * as tileScaner from "./utilities/tileScanner.js";
import selfTile from "./components/selfTile.vue";
import crossTile from "./components/crossTile.vue";
import leftTile from "./components/leftTile.vue";
import rightTile from "./components/rightTile.vue";
// import center from "./components/center.vue";
import viewDiscarded from "./components/viewDiscarded.vue";
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
    viewDiscarded,
    dicing,
    seating,
    // videoChat
  },
  data() {
    return {
      socket: io("http://192.168.1.64:3000"),
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
      inTurn: 'last',
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
      goAhead: new Array(4),
      temp: [],
    };
  },
  watch: {
    myTiles: function(){
      window.console.log(this.tileScaner(this.myTiles), this.self);
    }
  },
  created() {
   // window.console.log(this.tileScaner(a))
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
  
      this.rank = this.award(byTotal);//good here
      
      //window.console.log(data.map(d => d.t).sort((a, b)=>b-a))
      this.rank.forEach((e, idx) => {
        e.a === this.self
          ? (this.findMyRank(idx), this.users[this.self].myRank = this.myRank)
          : window.console.log("no rank?");
          this.inTurn="first";
         if(this.myRank==="first"){
            this.users[this.self].dealer=true;
         }
         this.seatObj = this.options;//set for seating
      });
      this.rank = this.rank.sort((a, b)=>a.a-b.a);
      this.socket.emit('ranked', 
      [this.users[this.self], this.self])

      setTimeout( 
        ((this.index = 0), //instru guide
        (this.stages = 'seating')),
        6000
      );
    });

    this.socket.on('rankedUsers', data=>{
      this.users = data
    })

    this.socket.on('selected', data => {
    this.seats = data[0][0];
    this.seatsObject = data[0][1];
    this.seatObj = data[0][2];
    this.inTurn = this.inOrder[data[1]];
    });

    //all seats selected
    this.socket.on("sitDown", () => 
      {
       ['SOUTH', 'EAST', 'NORTH', 'WEST']
       .filter((e, i)=>
        {
         if(e===this.mySeat) {
         this.users[this.self].seat = this.mySeat;
         this.pagePosition(i)
         this.users[this.self].index = this.self;
         this.socket.emit('ready', [this.users[this.self], this.self])
            }
        })
        this.inTurn = 'first';
        this.show = true;
        this.disabled = true;//later use
        this.stages = 'mahjiong';
      });

    this.socket.on('userSet', data =>
    { 
      this.users = data;
      this.setPlayers(data);
      this.socket.emit('makeWalls', data);
    });

    //ready to play...
    this.socket.on('setTiles', data => {
      this.startTiles(data)
    });

    //who is in turn...
    this.socket.on('inTurn', data=>{
    data==='start'&&
      this.myRank==='first'
      ?(data = this.mySeat, this.socket.emit('inTurn', data))
      :this.inTurn=data
            if(this.inTurn===this.mySeat){
              if(this.getTiles(this.self!==13)){return}//???
              this.goAhead.fill(false)
              this.goAhead[this.self] = true;
              this.socket.emit('goahead', this.goAhead)
            }
            
    })
    this.socket.on('goahead', data=>this.goAhead=data )
    
    this.socket.on("loggedOut", (data) => {
      window.console.log(`${data} left! `); //when somebody logged out
    });
    
    //all four players logged-in
    this.socket.on("Full", users => {
      this.counter = 0;
      this.users = users;
      this.stages = 'dicing';
    });
  
    this.socket.on('sort2', a=>{
    this.updTiles(a)
    })
    
    this.socket.on('getTile', data=>{
      this.updPublicTiles1(data)
    })

    //[this.self, payload[2], tileClicked]=data
    this.socket.on('disTile1', data => {//from 438
     let a = ['SOUTH', 'WEST', 'NORTH', 'EAST', 'SOUTH'];
      let i = a.findIndex(e=>e===this.inTurn);//pointer at index of a-array
      this.disabled = true;
      this.inTurn=a[i+1], this.socket.emit('inTurn', this.inTurn);//inTurn moves to next
     
      this.updMyTiles(data);//???
      this.updDiscardedTile(data);//???
      this.updPublicTiles1(data);///???
       if(this.inTurn===this.mySeat){
          this.goAhead.fill(false)
          this.goAhead[this.self] = true;
          this.socket.emit('goahead', this.goAhead)
       }
    })
  },
    
          
  computed: {
    ...mapGetters([
      'getPlayers',
      "getDicedNumber",
      'getTiles',
      'getPublicTiles',
      'getTableTiles',
    ]),
      tilesOnTableLength: {
       get(){
         let a1 = this.getTableTiles;
         if(!a1){return}
         return a1.length
       }
      },

      myTiles: {
       a:[],
       get(a) {
        let a1 = this.getTiles(this.self);
        if(!a1){return}
        a = a1.slice()
       return a;
        }
      },
     crossTiles: {
     get() {
      let a1 = this.getTiles(this.cross)
      if(!a1){return []}
      //a = a1.slice()
     if(a1){
     return a1.map(e => (e.chiPenGan)
     ? {...e, url: `${e.url}_s`}
     : {...e, url: 'standCross'})
           }
         return []
        }
     },
     rightTiles: {
     get() {
     let a1 = this.getTiles(this.right)
     if(!a1){return}
     if(a1){
     return a1.map(e => (e.chiPenGan)
     ?{...e, url:`${e.url}_s`}
     :{...e, url: "standRight"})
           }
           return []
        },
     },
     leftTiles: {
     get() {
     let a1 = this.getTiles(this.left)
     if(!a1){return}
     if(a1){
     return a1.map((e) => (e.chiPenGan)
         ?{...e, url: `${e.url}_s`}
         :{...e, url: 'standLeft'})
           }
     return []
       },
     },
   },

   methods: {
    ...mapActions(["setluckyNumber",
                   "startTiles",
                   "setPlayers",
                   'tileChosen',
                   'updDiscardedTile',
                   'updPublicTiles1',
                   'updTiles',
                   'updMyTiles']),
     sortTiles: function(a){
          this.socket.emit('sort1', a)
          },
     
     //payload=[myIndex, tileId, preClickedMyIdx]
     casting: function(payload) {
         // let arg = [this.self, payload[1]]
          //this.tileChosen(arg)//flag for the clicked tile /not needed??
          
          let tileClicked = this.myTiles[payload[2]];
          
          if(payload[2] !== payload[0]){//second click differs first --relocate
          this.updMyTiles([this.self, payload[0], payload[2], tileClicked]);
          return
          }

          if(payload[2]===payload[0]){//second click same as first  --discard
          if(this.inTurn!==this.mySeat){alert('not your turn'); return}
          if(this.myTiles.length===13){this.updPublicTiles1([false, this.self])}//13 when false
          this.socket.emit('disTile', [this.self, payload[2], tileClicked])//act at line 327????
          this.goAhead.fill(false)
          this.memory='';
          return
          }
     },

     getTile: function(data){
       if(this.getTiles(this.self).length===14){alert('too many'); return}
       if(this.inTurn!==this.mySeat){alert('not your turn'); return}
       if(!this.goAhead||!this.disabled){return}
       //let arg = [];
      //  (this.tilesOnTableLength===91&&this.myRank==='first')
      //  ?arg=[true, data]
      //  :arg=[false, data]
       this.updPublicTiles1([false, data])
       this.disabled = true
       this.socket.emit('getTile', data)
     },

     //after seat selected from 'seating'
     selected: function(data){ 
       let selectedIndex = data;//index selected in seating.vue
       let a = this.seatsObject[selectedIndex];//find the tile
       this.seats.splice(this.self, 1, a);//replace [seats]
       this.mySeat = a.replace(/B/, '').toUpperCase();
       this.seatsObject.splice(selectedIndex, 1);//del the tile
       this.seatObj.splice(selectedIndex, 1);//del the name
       let payload = [this.seats, this.seatsObject, this.seatObj];
       this.socket.emit('seatSelected', payload);
       if(this.inTurn==='last'){
         this.socket.emit('inTurn', 'start')}//start game
     },

    //$emit when dicing
    // notify other apps
    change: function(data) {
      this.index = 1;
      this.socket.emit("diceChange", data);
    },

    pagePosition: function(data) {
      let temp = this.users[this.self]
      this.self = data;
      this.users[this.self]=temp//1

      temp = this.users[this.right]
      this.right = this.self + 1;
      if (this.right > 3) {
        this.right = 0;
      }
      this.users[this.right]=temp//2

      temp = this.users[this.cross]
      this.cross = this.right + 1;
      if (this.cross > 3) {
        this.cross = 0;
      }
      this.users[this.cross]=temp//3

      temp = this.users[this.left]
      this.left = this.cross + 1;
      if (this.left > 3) {
        this.left = 0;
      }
      this.users[this.left]=temp//4
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
    
    //t: tileSort of discarded
    tileScaner: function  (tile, t){
    tile = tile.sort((a, b)=>(a.tileSort - b.tileSort))
    //let x = tile.length; 
    let peng = [];
    let chain = [];// found = false;
    if(t){
      peng = this.pengFinder(tile, peng, t)  //1. find  dup tiles making pengs

      for(let k=0; k<4; k++){// four groups of 3 chains and pengs
        for(let i=1; i<3; i++){ //no more than 3 chains in winning hands
           if(k==0){ //2. find chain going up (3, 4, 5)
              let n = Number(t) + i;
              chain.push(this.chainFinder(tile, n, chain))
              //if(chain.length===2){k=2}
              if(chain.length===1&&(Number(chain[0]) !== Number(t)+1))
                {chain=[]}
            }
        }
        for(let i=1; i<3; i++){
           if(k==1){ //3. find chain going down (3, 2, 1)
              let n = Number(t) - i;
              chain.push(this.chainFinder(tile, n, chain))
              if(chain[0]===chain[1]){chain.shift()}//if dup delete first one
              if(i===2&&chain.length===1)[chain=[]]//ignor if length not enough
        }
      }
    }
  }
  return [[peng, 'peng'], [chain, 'chain']]
},
     chainFinder: function (tile, n, chain){
       tile.forEach((e) => {
         if (e.tileSort == JSON.stringify(n))
           {if(chain[chain.length-1]!==e.tileSort) chain.push(e.tileSort)}
       })
       if(chain.length===2){window.console.log(chain.length)}
     // return chain
    },

     pengFinder: function (tile, peng, t){
      tile.forEach((e, i) => {
        if(t){ 
            if(e.tileSort===t){
              peng.push(e.tileSort)
              }
            }
            else {
                for (let k = 0; k < 13; k++ ){
                  if(i!==k){
                     if(e.tileSort === tile[k]){
                       peng.push(e.tileSort)
                     }
                  }
                }
            }  
       }) 
    }
    // function deDup (dup){
    //   let uniqueEle = [];
    //   dup.forEach((e)=>{console.log(e, 'deDup')
    //       if(!uniqueEle.includes(e)){
    //         uniqueEle.push(e)}
    //       })
    //   dup = uniqueEle    
    // } 
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
      ".center."
      "left center right"
      "self self self";
  }
}
</style>
