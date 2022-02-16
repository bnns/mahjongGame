<template class="box">
    <div id="app" class="container">
        <div class="self" v-show="show">
              <SelfTile :self='self'
                        :myTiles='myTiles'
                        :inTurn='inTurn'
                        :mySeat='mySeat'
                        :myRank='myRank'
                        @sorting="sortTiles"
                        @casting='casting'/>
        </div>
        <div class="cross" v-show="show">
      <CrossTile :cross="cross"
                 :crossTiles="crossTiles"/>
        </div>
        <div class="left" v-show="show">
      <LeftTile :left="left"
                :leftTiles='leftTiles'/>
        </div>
        <div class="right" v-show="show">
      <RightTile :right="right"
                 :rightTiles="rightTiles" />
        </div>

        <div class="center" v-show="show">
            <ViewDiscarded
              :self="self"
              :right="right"
              :left="left"
              :cross="cross"
              :users="users"
              :goAhead='goAhead'
              :frontTileBack="frontTileBack"
              @mahjiong="hula"
              @getTile="getTile"
              :tilesOnTableLength="tilesOnTableLength"
            />
        </div>

        <div class='center' v-if="stages==='dicing'">
            <Dicing
               :self="self"
               :right="right"
               :left="left"
               :cross="cross"
               :index='index'
               :name="name"
               :users="users"
               :stages="stages"
               :dices="dices"
               :diceTotal="diceTotal"
               :disabled="disabled"
               @change="change"
               @diced="diced"
             />
        </div>

        <div class="center" v-if="stages==='seating'">
             <Seating
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
            <Login
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
import {grouping, findChowHand,findPong} from "./utilities/hula";
//import * as tileScaner from "./utilities/tileScanner.js";
import SelfTile from "./components/selfTile";
import CrossTile from "./components/crossTile";
import LeftTile from "./components/leftTile";
import RightTile from "./components/rightTile";
import ViewDiscarded from "./components/ViewDiscarded";
import Login from "./components/login";
import Dicing from "./components/dicing";
import Seating from "./components/Seating";
//import videoChat from './components/videoChat.vue'
export default {
  name: "App",
  components: {
    SelfTile,
    Login,
    CrossTile,
    LeftTile,
    RightTile,
    ViewDiscarded,
    Dicing,
    Seating,
    // videoChat
  },
  data() {
    return {
      socket: io("http://localhost:3000"),//localhost could not be accesed by other divices
      name: "John",
      users: [],
      myRank: '',
      mySeat:'',
      myId:'',
      index: 0,
      stages: '',
      roomNumb: null,
      mySocketId: "",
      dice: [
        "one_point",
        "two_points",
        "three_points",
        "four_points",
        "five_points",
        "six_points",
      ],
      dices: [],
      options: [
         "East. 東", "South南","West 西", "North北",
        ],
      inTurn: 'last',
      duplicated: false,
      disabled: false,
      wasConnected: false,
      diceTotal: [],
      self: 0,
      right: 1,
      cross: 2,
      left: 3,
      inOrder:[
        'first', 'second', 'third', 'last'
      ],
      seats://let created do it??
      [
        "seats","seats","seats","seats"
        ],
      seatsObject:
      [
         "EAST","SOUTH","WEST","NORTH"
        ],
      seatObj:this.options,//items reduced by each selected
      counter:0,
      rank:[],//4 objects of {plaer index, diced number, rank}
      show:false,
      goAhead:new Array(4).fill(false),
      seatTaken:true,
      flowers:false,
      pengAllowed:false,
      chowAllowed:false,
    };
  },
  
  created(){
    let a=this.getDicedNumber
    this.goTotal(a)//show total in dicing

    this.socket.on('wasconnected',()=>{
      let data
      if(this.wasConnected){
        data=[this.roomNumb, this.myId]
      }else{data='new', this.wasConnected=!this.wasConnected}
      this.socket.emit('current', data)
    })
    //need to use roomId for communication!
    this.socket.on("loggedIn", data=>{
        // this.wasConnected=true
        this.stages='login',
      (this.users.length===0)
      ?(this.roomNumb=data[data.length-1].roomId, 
       this.myId=data[data.length-1].userId)
      :window.console.log(this.roomNumb+"/"+"New joineded!");
      //need info server into the same room
      if(this.counter<5)//reconnect?
      {
        this.mySocketId=this.socket.id;
        this.counter = data.length;
      }
     });
      
  //  let array=[{typeSort:122},{typeSort:123},{typeSort:124},
  //  {typeSort:103},{typeSort:104},{typeSort:105},{typeSort:108},
  //  {typeSort:108},{typeSort:108},{typeSort:128},{typeSort:128},
  //  {typeSort:128},{typeSort:132},{typeSort:122}]

  //  window.console.log(a=findChowHand(array))
   //window.console.log(findPong(array))
  //  if(a.length>1){
      // window.console.log(grouping(a))
    // window.console.log(grouping(array))

    this.socket.on("userOnline", data=>{
      // user registed online from server
      this.users.push(data);
    });

    //all four players logged-in
    this.socket.on("Full", users=>{
      this.counter=0;
      this.users=users;
      this.stages='dicing';
    });
    
    // from server to all 4 apps
    this.socket.on("diceChange1", data=>{
      this.setluckyNumber(data); //mutates store (unity 4 stores)
      this.goTotal(this.getDicedNumber);//addUp
    });
    this.socket.on("dup", dup=>{
      dup.some(e=>{
        e.index===this.self
          ? this.disabled=false
          : "" ;
      });
    });

    //server notify that dup treated data.a="user index"
    this.socket.on("allDiced",data=>{//data.t="diced number"
      let byTotal=data.sort((a, b)=>b.t-a.t);//number bigger in front
     
      this.rank=this.award(byTotal);
       let copy=[...this.rank]

     //matching player idx to diced rank
      copy.forEach((e)=>{
        e.a===this.self
          ?(this.users[this.self].myRank=e.n, this.myRank=e.n)
          :"no rank?"
  
        // })
         this.inTurn="first";
         if(this.myRank==="first"){
            this.users[this.self].dealer=true;
         }
      })
         this.socket.emit('ranked', 
         [this.users[this.self], this.self])
    })//alldiced  
        
        this.socket.on('rankedUsers',data=>{//good here???
           this.users=data
           //seatTaken is false
           if(!this.seatTaken){
           this.seatObj=this.options;//set for seating????????????
           setTimeout( 
            ((this.index=0), //instru guide
            (this.stages='seating')),
            6000
           )}
           //seatTaken is true
           if(this.seatTaken){
             this.myRank==="first"
             ?this.mySeat="EAST"
             :this.myRank==="second"
               ?this.mySeat="SOUTH"
               :this.myRank==="third"
                  ?this.mySeat="WEST"
                  :this.myRank==="last"
                     ?this.mySeat="NORTH"
                     :'doNothing'

          this.users[this.self].mySeat=this.mySeat
          this.socket.emit("seatSelected", "seatTaken")
          //this.myself=index
          // this.consisPlayers(index)
         // window.console.log(payload)
          }
      })
    
         this.socket.on('selected', data=>{
          if(!this.seatTaken){
         this.seats=data[0][0];
         this.seatsObject=data[0][1];
         //window.console.log(this.seatsObject)
         this.seatObj=data[0][2]//control the order
         
         this.inTurn=this.inOrder[data[1]]//this needed!!!!
         }
       });
    //all seats selected//this action voided!!!!!!!!!!!!
    this.socket.on("sitDown",()=> 
      {
        // this.startTiles(data),//from 336 whick might not needed!!!
      // if(this.seatTaken){
    ['EAST','SOUTH','WEST','NORTH']//if seat choosen [inOrder]????
      .forEach((e, i)=>{
        if(e===this.mySeat){
        this.users[this.self].index =i;
        this.socket.emit('ready', [this.users[this.self], i])
        this.self=i;
        this.consisPlayers(i)
            }
         })
      });
          
    this.socket.on('ready1', data=>
    { 
      this.users=data[1];
      // this.self=data.index;
       this.inTurn='first';
       if(this.seatTaken){this.inTurn='EAST',
       (this.mySeat==='EAST')
       ?(this.goAhead[this.self]=true,
       window.console.log(this.goAhead))//
       :'doNothing'}
       
        this.disabled=true;//later use
        this.setPlayers(data[1]);
         this.startTiles(data[0])
        this.stages='mahjiong', 
        this.show=true
        if(this.goAhead[this.self]===true){
        this.socket.emit('start', this.goAhead)}
       // this.socket.emit('makeWalls', data)
    });

    this.socket.on('start1',data=>
    this.goAhead=data)
  
    //who is in turn...
    this.socket.on('inTurn1', data=>{//"start"
   ((data==='start')&&
      (this.myRank==='first'))//use seat now on
      ?(data=this.mySeat,
     // this.goAhead[this.self]=true,//why not react???????????????
      this.socket.emit('inTurn', data))//=this.mySeat
      :this.inTurn=data//inTurn=mySeat[east, south, west, north]
           if(this.inTurn===this.mySeat){
              //if(this.getTiles(this.self).length!==13){return}//???
              this.goAhead.fill(false)
              this.goAhead[this.self]=true;
              //  this.goAhead=data, 
              this.socket.emit('goahead', this.goAhead)
            }  
    })
    this.socket.on('goahead1',data=>{
    this.goAhead=data})//good
    
    this.socket.on("loggedOut", (data)=>{
      window.console.log(`${data} left! `); //when somebody logged out
    });

    this.socket.on('getTile1', data=>{//broadcasted!
      this.consisTiles(data)
    })

    this.socket.on('sort1', a=>{
    this.consisTiles(["sorted",a,this.getTiles[a]])
    }),
    //identify pengable?
    this.socket.on('deserted1', tileCastedNow=>{
       this.myTiles.map(e=>{
       let pengCheck=0, chowCheck=0;
       (e.tileSort===tileCastedNow)
       ?pengCheck++
       :(e.tileSort===tileCastedNow-1||e.tileSort===tileCastedNow)
       ?chowCheck++
       :"doNothing";
       (pengCheck>1||chowCheck>1)?this.pengAllowed=this.chowAllowed=true
       :this.pengAllowed=this.chowAllowed=false
       })
       })
   // data=[this.self, this.getTiles(this.self),
        //  this.getTableTiles, this.getDisCardedTiles(this.self), flowers])
    this.socket.on('disTile1', data=>{//might have bug here
       if(data[5]){this.consisTiles([data[0],
       data[1],data[2],data[3],data[4]])
       window.console.log(data[5]); return}
       let a=['SOUTH', 'WEST', 'NORTH', 'EAST', 'SOUTH'];
       let i=a.findIndex(e=>e===this.inTurn);//find the first match
       this.disabled=true;
       this.inTurn=a[i+1], this.socket.emit('inTurn', this.inTurn);//inTurn moves to next
     
       this.consisTiles([data[0],data[1],data[2],data[3],data[4]])
       if(this.inTurn===this.mySeat&&data[4]<330){
          this.goAhead.fill(false)
          this.goAhead[this.self] = true;
          this.socket.emit('goahead', this.goAhead)
       }
    })
     this.socket.on('ping',()=>
     { 
         let payload;
         {
       let lastId=this.mySocketId;
       this.mySocketId=this.socket.id;
       
       payload={
       roomId: this.roomNumb,
       lastId: lastId,
       userId: this.myId,//when logged in assigned
       id:this.mySocketId,
       };
        this.socket.emit('ping1', payload)
       //this.socket.emit("reconnect", payload);
      }
      
      // this.socket.emit('pong', payload)
      //   window.console.log("send Pong")
      
      //socket.emit('pong', {beat: 1});
    });
  },
            
  computed: {
    ...mapGetters([
      'getPlayers',
      "getDicedNumber",
      'getTiles',
      'getDisCardedTiles',
      'getFromFront',
      'getTableTiles',
    ]),
      frontTileBack:{
        get(){ 
          let a=this.getFromFront
          // if(!a){a=0}
          return a
          }
      },
      tilesOnTableLength:{
       get(){
         let a=this.getTableTiles
         if(!a){return}
         return a.length
       }
      },
      myTiles:{
       get(){
        let a=this.getTiles(this.self);
        if(!a){return}
       return a;
        }
      },
     crossTiles:{
     get(){
      let a=this.getTiles(this.cross)
      if(!a){return []}
     if(a){
     return a.map(e=>(e.chiPenGan)
     ? {...e, url: `${e.url}_s`}
     : {...e, url: 'standCross'})
           }
         return []
        }
     },
     rightTiles:{
     get(){
     let a=this.getTiles(this.right)
     if(!a){return}
     if(a){
     return a.map(e=>(e.chiPenGan)
     ?{...e, url:`${e.url}_s`}
     :{...e, url: "standRight"})
           }
           return []
        },
     },
     leftTiles:{
     get(){
     let a=this.getTiles(this.left)
     if(!a){return}
     if(a){
     return a.map(e=>(e.chiPenGan)
         ?{...e, url:`${e.url}_s`}
         :{...e, url:'standLeft'})
           }
     return []
       },        
     },
   },

   watch:{//try to activate selfTile when tile added
     goAhead:{
          handler(val){
            this.goAhead=val
            return},
          deep: true
     },
     myTiles:{
          handler(val, old){
            if(val.length===old.length){return}
            window.console.log(val, old)
            this.updTakeFromFront
            return val},
          deep:true
     }
   },
   methods:{  
    ...mapActions(["setluckyNumber",
                   "startTiles",
                   "setPlayers",
                   'tileChosen',
                   'updDiscardedTile',
                   'updTiles',
                   'updTakeFromFront',
                   'consisTiles',
                   'updMyTiles']),
     //$emit when dicing
     // notify other apps
      change: function(data){
       this.index=1//for guide instruction
       this.socket.emit("diceChange", data);
      },

     selected: function(data){
       let selectedIndex=data;//index selected in seating.vue
       let a=this.seatsObject[selectedIndex];//find the seatname
       this.seats.splice(this.self, 1, a);//replace [seats]????
       this.mySeat = a.replace(/B/, '').toUpperCase();
       this.users[this.self].mySeat=this.mySeat;
       this.seatsObject.splice(selectedIndex, 1);//del the tile
       this.seatObj.splice(selectedIndex, 1);//del the name
       let payload = [this.seats, this.seatsObject, this.seatObj];
       window.console.log("selected","/",data)
       this.socket.emit('seatSelected', payload);//four times
       if(this.inTurn==='last'){
         this.socket.emit('inTurn', 'start')}//start game
     },

     sortTiles: function(a){
          this.updMyTiles(["sorting", a])
          this.socket.emit('sort', a)
          },
     
     //payload=[myIndex, tile.id, preClickedMyIdx, preClickedtileId, tileSort]
     casting: function(payload){
          //relocation  payload[2]=tile.index, tile.currentposition
          if(payload[3]!==payload[1]){//second click differs first --relocate
          this.updMyTiles(["relocate", this.self, 
          payload[0], payload[1], payload[2],payload[3]]);//
          return                                
         }
          //disTile
          if(payload[1]===payload[3]){//second click same as first  --discard
          if(payload[4]>329){this.updTakeFromFront, 
          this.flowers=true, window.console.log(this.getFromFront)}//?????????????????????
          if(this.inTurn!==this.mySeat)
          {alert('not your turn'); return}
          let data=["deserted", this.self, payload[1]]// payload[1]=tile.id 
          this.updMyTiles(data)
          this.socket.emit('disTile', [this.self, 
          this.getTiles(this.self),
          this.getTableTiles, 
          this.getDisCardedTiles(this.self),
          this.flowers])//????????????
                          
         
         // {this.goAhead.fill(false)} //finished casting??? 
         
          this.memory='';
           this.socket.emit('deserted', payload[4])
          return
          }
          // this.socket.emit('myTile', this.self)//info other stores of changes
     },

    //data = this.self, from viewDiscated dealing
     getTile: function(data){
       if(this.getTiles(data).length===14){alert('too many'); return}
       if(this.inTurn!==this.mySeat){alert('not your turn'); return}
       if(!this.goAhead||!this.disabled){return}
       //let arg = [];
      //  (this.tilesOnTableLength===91&&this.myRank==='first')
      //  ?arg=[true, data]
      //  :arg=[false, data]
      // this.updPublicTiles1([false, data])//need be done later????????
       this.disabled = true
       data=["inserted", data]
       this.updMyTiles(data)
       data=[data[1], this.getTiles(data[1]), 
       this.getTableTiles, this.getDisCardedTiles(data[1])]
       this.socket.emit('getTile', data)
     },
    
    consisPlayers:function(index){
      this.right=(index+1)>3
                 ?0:index+1;
       this.cross=(this.right+1)>3
                 ?0:this.right+1;
       this.left=(this.cross+1)>3
                 ?0:this.cross+1;
      },

    pagePosition:function(data){//data bring new index
      let temp=this.users[this.self]
      this.self=data;
      this.users[this.self]=temp//1

      temp=this.users[this.right]
      this.right=this.self+1;
      if(this.right>3){
        this.right=0;
      }
      this.users[this.right]=temp//2

      temp=this.users[this.cross]
      this.cross=this.right+1;
      if(this.cross>3){
        this.cross=0;
      }
      this.users[this.cross]=temp//3

      temp=this.users[this.left]
      this.left=this.cross + 1;
      if(this.left>3){
        this.left=0;
      }
      this.users[this.left]=temp//4
    },

    finishOnLogin:function(user){//self on user index when start
      this.name=user.name;
      this.pagePosition(user.index);
      this.socket.emit("newuser",user);
    },
    hula:function(){
  //     let array=[{typeSort:122},{typeSort:123},{typeSort:124},
  //  {typeSort:103},{typeSort:104},{typeSort:105},{typeSort:108},
  //  {typeSort:108},{typeSort:108},{typeSort:128},{typeSort:128},
  //  {typeSort:128},{typeSort:122},{typeSort:122}]
   let array=this.myTiles.map(e=>e.tileSort)
   let a
   window.console.log(a=findChowHand(array))
   //if true broadcast needed
   window.console.log(findPong(array))
  
      window.console.log(grouping(a)+""+"Hula!")
    // window.console.log(grouping(array))
    },
    
     //from dicing $emit when finished
    diced:function(data){
      let a=data[0];
      let b=data[1].reduce((ac,e)=>ac+e);
      let payload={a:a,t:b}; //a index, t total
      this.disabled=true;
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

    award:function(rank){
      let a=['first','second','third','last'];
      for(let i = 0; i < 4; i++){
        rank[i].n = a[i]
      }
      return rank//ranked one awarde "first"...
    },//rank[0].a=player's index, .t=number diced, .n="first"
    
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
  display:flex;
  flex-flow: column;
  grid-area: right;
  /* justify-self: start; */
  align-self: start;
  z-index: 1;
  /* height: 100vh;
           width: 10vh; */
}
.center {
  display:flex;
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
    "left center right"
    "left self right"
    "left self right";
  /* background-color: rgba(rgb(243, 171, 171), rgb(239, 245, 239), rgb(212, 212, 231), 0.4); */
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
