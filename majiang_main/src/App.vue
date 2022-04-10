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
                        :crossTiles="crossTiles"
                      />
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
              :myTiles='myTiles'
              :goAhead='goAhead'
              :chowAllowed='chowAllowed'
              :pengAllowed='pengAllowed'
              :frontTileBack="frontTileBack"
              :discardedTiles='discardedTiles'
              :lastCasted='lastCasted'
              :tilesCount='tilesCount'
              @updTileCount='updTileCount'
              @updateCasted='updateCasted'
              @pengChowKong="pengChowKong"
              @hula="hula"
              @restart='restart'
              :restartFlag='restartFlag'
              :iWon="mahjiong"
              @getTile="getTile"
              :tilesOnTableLength="tilesOnTableLength"
              ref='ViewDiscarded'
            />
        </div>

        <div class='center' v-if="stages==='dicing'&&!show">
            <Dicing
               :self="self"
               :right="right"
               :left="left"
               :cross="cross"
               :index='index'
               :name="name"
               :users="users"
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
               @signIn="signIn"
               @signUp="signUp"
               :counter="counter"
               :name="name"
               :myId="myId"
               :room="room"
               :roomId="roomNumb"
               :rmName="rmName"
               :mySocketId="mySocketId"
            />
        </div>
    </div>
</template>
<script>
import io from "socket.io-client";
import { mapGetters, mapActions } from "vuex";
// import {grouping, findChowHand,findPong} from "./utilities/hula";
//import * as tileScaner from "./utilities/tileScanner.js";
import SelfTile from "./components/selfTile";
import CrossTile from "./components/crossTile";
import LeftTile from "./components/leftTile";
import RightTile from "./components/rightTile";
import ViewDiscarded from "./components/viewDiscarded";
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
  //--port 8081 --host 0.0.0.0 --host localhost",  //added to packagejsn
  data() {
    return {
      socket: io("http://192.168.1.64:3000"),//localhost could not be accesed by other divices
      name: "John",
      users: [],
      room:null,
      tilesCount:new Array(4).fill(14),
      myRank: '',
      mySeat:'',
      myId:'',
      index: 0,
      stages: '',
      roomNumb: null,
      rmName:null,
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
      lastCasted:[{url:'eastR'}, this.self],
      mahjiong:null,
      restartFlag:false,
    };
  },
  
  created(){
    this.users=(this.getPlayers.length!==0)
    ?this.getPlayers
    :[{mySeat:"EAST",
      name:this.name
      },{mySeat:"EAST",
      name:this.name
      },{mySeat:"EAST",
      name:this.name
      },{mySeat:"EAST",
      name:this.name
      }]
    let a=this.getDicedNumber
    this.goTotal(a)//show total in dicing
    
    // this.myTiles=this.getTiles(this.self)

    // this.socket.on('wasconnected',()=>{
    
    //   this.mySocketId=this.socket.id;
    //   let data
    //   if(this.wasConnected){
    //     data=[this.roomNumb, this.myId]
    //   }else{data=this.wasConnected, this.wasConnected=true}
    //   this.socket.emit('current', data)
    // })
    this.socket.on('whoIsIn', ()=>{
      console.log('whoIsIN', this.counter)//send roomName????
      let abc = (JSON.parse(localStorage.getItem('myinfo')))
     // this.name=abc.users[this.counter].name
      this.roomNumb = abc.roomNumb
      this.rmName = abc.roomName
      console.log((this.rmName))
       this.stages='login'
    })
//=================================================
    //need to use roomId for communication!
    // this.socket.on("loggedIn", data=>{
    //     this.wasConnected=true
    //     this.stages='login',
    //   (!this.roomNumb)
    //   ?(this.roomNumb=data[data.length-1].roomId, 
    //    this.myId=data[data.length-1].userId)
    //   :'';
    //   //need info server into the same room
    //   if(this.counter<5)//reconnect?
    //   {
    //     this.mySocketId=this.socket.id;
    //     this.counter = data.length;
    //   }
    //  });

    this.socket.on("loggedIn", data=>{
      console.log('loggedIn', data)
      // user registed online from server
      this.room=data[0]
      this.counter=data[1]
      // this.self=this.counter-1
      // this.pagePosition(this.self);
    });

    this.socket.on('new_user', data=>{
      let a=data.users.slice()
      localStorage.removeItem('myinfo');
      this.index=a.length
      console.log(this.index, 'new_user', data)
      this.roomNumb=data.roomId
      this.counter=data.users.length
      this.myId=data.users[data.users.length-1].userId
      if(!this.flowers){this.pagePosition(this.counter-1)}
      localStorage.setItem('myinfo', JSON.stringify(data))
      this.flowers=true
    })

    this.socket.on('signInReady', arg=>{
      this.counter=arg
      !this.flowers?(this.self=this.counter-1,
      this.pagePosition(this.self)):''
      this.flowers=true 
    })
    
//======================================================
    //all four players logged-in
    this.socket.on("Full", room=>{
      this.counter=0;
      this.users=room.users;
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
            5000
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
      { this.stages='mahjiong',
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
       ?(this.goAhead[this.self]=true)//
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
      console.log('getTiles1', ' / ', data)
      setTimeout(()=>{ this.consisTiles(data)},3000)
      this.lastCasted=[{url:'board'}, this.self]
    })

    this.socket.on('sort1', a=>{
    this.consisTiles(["sorted",a,this.getTiles[a]])
    }),

    //identify pengable? chowable?=====================================
    this.socket.on('deserted1', tileCastedNow=>{//[1]===areaId
       let myTiles=this.getTiles(this.self)
       let x=(this.self-1<0)?3:(this.self-1)
       let justified=tileCastedNow[1]===x
     
       this.lastCasted=tileCastedNow
       let pengCheck=[tileCastedNow[0].tileSort], chowCheck=[tileCastedNow[0].tileSort]
           myTiles.map(e=>{
           (e.tileSort===tileCastedNow[0].tileSort)
           ?(pengCheck.push(e.tileSort))
           :''
           }),
           //=================================
           myTiles.forEach(e=>{
           (e.tileSort===chowCheck[0]-1)&&(tileCastedNow[0].tileSort<210)   
           ?(chowCheck.unshift(e.tileSort), chowCheck= this.backward(chowCheck))
           :(e.tileSort===chowCheck[chowCheck.length-1]+1)
           &&(tileCastedNow[0].tileSort<210)
           ?chowCheck.push(e.tileSort)
           :"doNothing";
           })

       pengCheck.length>2
       ?(this.pengAllowed=true, window.console.log('peng ready', pengCheck))
       :this.pengAllowed=false

       chowCheck.length>2&&justified
       ?(this.chowAllowed=true, console.log('chow ready', chowCheck))
       :this.chowAllowed=false
 //=================================================================keep
      //  if(chowCheck.length>2){
      //    let tile=this.getTiles(this.self)   
      //    tile.push(tileCastedNow[0])
      //    this.$refs.ViewDiscarded.seeIfHula(tile );
      //    console.log('/cannot debugger!?')
      //    }
         // debugger????????????????????????
    })//else check if Hula!!!!!!!!!!!!!!!!!!!!!
//============check chow or peng===============================

   // data=[this.self, this.getTiles(this.self),
        //  this.getTableTiles, this.getDisCardedTiles(this.self), flowers])
    this.socket.on('disTile1', data=>{
     // this.lastCasted=data[5]
      this.flowers=data[4]
    
       setTimeout(()=>{ this.consisTiles([data[0],data[1],data[2],data[3]])},3000);
      
      //  this.$set(this.discardedTiles, this.getDisCardedTiles())
       if(!data[4]){
         let x=this.getTiles(this.self)//why???????????????
       
         if(x.length===this.tilesCount[this.self]){alert("you not done yet!"); return}
       let a=['SOUTH', 'WEST', 'NORTH', 'EAST', 'SOUTH'];
       let i=a.findIndex(e=>e===this.inTurn);//find the first match
       this.disabled=true;
       this.inTurn=a[i+1], this.socket.emit('inTurn', this.inTurn);//inTurn moves to next
       //}
      //  this.consisTiles([data[0],data[1],data[2],data[3],data[4]])
       if(this.inTurn===this.mySeat){
          this.goAhead.fill(false)
          this.goAhead[this.self] = true;
          this.socket.emit('goahead', this.goAhead)
       }}else{this.updTakeFromFront()}
    })
    this.socket.on('pengChowKong1', payload=>{
             if(this.self!==payload[3]){this.disabled=true}
             this.pengAllowed=this.chowAllowed=false
             this.goAhead.fill(false)
             this.goAhead[payload[3]]=true;//[4]=areaId
             this.inTurn=this.seatsObject[payload[3]]
             this.socket.emit('goahead', this.goAhead)//added for it
            // setTimeout(()=>{ this.updMyTiles(payload)},1000);
             this.updMyTiles(payload)
    })
    this.socket.on('updateCasted',()=>
       this.lastCasted=[{url:'board'}, this.self])

    this.socket.on('mahjiong1', data=>{//myTiles
        this.mahjiong=data
    })

     this.socket.on('restart1', payload=>{
     this.users=payload[1],
     this.goAhead=payload[2],
     this.inTurn=payload[3],
      this.setPlayers(this.users),
      this.startTiles(payload[0])
      this.tilesCount=new Array(4).fill(14)
      this.flowers=this.chowAllowed=this.pengAllowed=false
      this.mahjiong=null
      this.restartFlag=true
      this.lastCasted=[{url:'board'}, this.self]
     // this.updMyTiles(['restart'])
      })
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
          return a
          }
      },
      tilesOnTableLength(){
         let a=this.getTableTiles
         if(!a){return}
         return a.length
      },
      discardedTiles(){
         let a=this.getDisCardedTiles()
         if(!a){return}
         return a
         },
      myTiles(){
         return this.getTiles(this.self)
      },
      crossTiles(){
         return this.getTiles(this.cross)
     },
      rightTiles(){
         return this.getTiles(this.right)
     },
     leftTiles(){
         return this.getTiles(this.left)
       }  
     },
  
   watch:{//try to activate selfTile when tile added    
     goAhead:{
          handler(val){
            this.goAhead=val
            return},
          deep: true
     },
    discardedTiles:{
           deep: true,
           handler(val)
            {return val}
        },
     diceTotal:{
           handler(val){
             console.log(val, ' / watch dices')
           }
     },   
     flowers:{
          handler(val){
            return val
          }
     }
   },
     updated() {//not work yet! //watch for tiles changed so....
       if(this.getTiles(this.self)){if(this.myTiles!==this.getTiles(this.self)){
          console.log('changed mytiles')}}
       if(this.getTiles(this.right)){if(!this.getTiles(this.right)){
         console.log('undefined righttiles')}}
       if(this.getTiles(this.cross)){if(!this.getTiles(this.cross)){
         console.log('undefined crosstiles')}}
       if(this.getTiles(this.left)){if(!this.getTiles(this.left)){
         console.log('undefined lefttiles')}}
    },
   methods:{  
    ...mapActions(["setluckyNumber",
                   "startTiles",
                   "setPlayers",
                   'tileChosen',
                  //  'updDiscardedTile',
                  'updTilesCount',
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
       this.mySeat=a.replace(/B/, '').toUpperCase();
       this.users[this.self].mySeat=this.mySeat;
       this.seatsObject.splice(selectedIndex, 1);//del the tile
       this.seatObj.splice(selectedIndex, 1);//del the name
       let payload=[this.seats, this.seatsObject, this.seatObj];
       window.console.log("selected","/",data)
       this.socket.emit('seatSelected', payload);//four times
       if(this.inTurn==='last'){
         this.socket.emit('inTurn','start')}//start game
     },

     sortTiles: function(a){
          this.updMyTiles(["sorting", a])
          this.socket.emit('sort', a)
          },

     backward: function (chowCheck){
       let checkTiles = this.getTiles(this.self)
        checkTiles.forEach(e=>{
       if(e.tileSort===chowCheck[0]-1){
         chowCheck.unshift(e.tileSort)}
         })
    
       return chowCheck
          },
     
     casting: function(payload){//[0][0]Idx_1, [0][1]tile_1; [1][0]idx_2, [1][1]tile_2
         this.restartFlag=false
         if(payload[1][0]!==payload[0][0]){//[0] pre-click differs [1] --relocate
          this.updMyTiles(["relocate", this.self, 
          payload[1][0], payload[1][1],  payload[0][1]]);//
          return                                
         }
        
          if(payload[1][0]===payload[0][0]){//second click same as first  --discard
          // if(payload[1][1].tileSort>319){this.updTakeFromFront(), 
          // this.flowers=true}else{this.flowers=false}//?????????????????????
          if(this.inTurn!==this.mySeat)
          {alert('not your turn'); return}
          if(payload[1][1].tileSort>319){this.updTakeFromFront(), 
          this.flowers=true}else{this.flowers=false}//line 621????

          let data=["deserted", this.self, payload[1][1].id]// payload[1]=tile.id 
          // window.console.log(this.getDisCardedTiles(this.self))//no use
         this.updMyTiles(data)//time delay!!!!!!
         
          // this.$set(this.discardedTiles[this.self], this.getDisCardedTiles(this.self))
          payload=[this.self, 
          this.getTiles(this.self),
          this.getTableTiles, 
          this.getDisCardedTiles(),
          this.flowers, payload[1][1]]
          setTimeout(()=>{ this.socket.emit('disTile', payload )},1000);
          // this.socket.emit('disTile', payload )

          this.lastCasted=[payload[5], this.self]//tile
          this.memory='';
          if(!this.flowers){
          this.socket.emit('deserted', this.lastCasted)//needed or not?????
          return
          }
          // this.socket.emit('myTile', this.self)//info other stores of changes
     }},

    //data = this.self, from viewDiscated dealing
     getTile: function(data){
       
       if(this.myTiles.length===this.tilesCount[this.self])
       {alert('too many'); return}
       if(this.inTurn!==this.mySeat){alert('not your turn'); return}
       if(!this.goAhead&&!this.disabled){return}//"||""
     
       this.disabled=true
       data=["inserted", data]
     
       this.updMyTiles(data)
       this.$set(this.myTiles, this.getTiles(this.self))
       data=[data[1], this.getTiles(data[1]), 
       this.getTableTiles, this.getDisCardedTiles()]//self????
       this.socket.emit('getTile', data)
       this.lastCasted=[{url:'board'}, this.self]
     },
     //[0]hula,[1]*peng, [2]chow, [3]kong, [4]indexofDiscardedTile, 
     //[5]tileId, [6]this.self*/
     pengChowKong: function(data){
     
       let payload=[data[4],data[5],data[6]]
       this.disabled=false//just added????????????????
       if(data[0]){
         payload.unshift('hula')
       }else if(data[1]){
          payload.unshift('peng')
       }else if(data[2]){
          payload.unshift('chow')
       }else if(data[3]){
          payload.unshift('kong')
       }
       this.socket.emit('pengChowKong', payload)
     },
     updateCasted:function(){
        this.lastCasted=[{url:'board'}, this.self]
        this.socket.emit('updateCasted')
     },
     updTileCount:function(){
       console.log( this.tilesCount[this.self]+1, this.self, this.tilesCount)
       this.tilesCount[this.self]=this.tilesCount[this.self]+1
       this.updTilesCount(this.self)
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
   //first time:['room', roomname] / ['name', roomname, username ]
    signIn:function(arg){
    console.log(arg, ' / sign in')
   
     arg[0]==='name'
     ? (this.name=arg[2])
     : this.roomNunb=arg[1];
     let payload=[arg[0], arg[1],arg[2]]
     
      this.socket.emit("sign_in",payload);
    },

    signUp:function(arg){
      this.name=arg[0]
      this.roomNunb=arg[1]
      this.passWord=arg[2]
      // this.pagePosition(user.index);
      this.socket.emit('sign_up', arg)
    },
    hula:function(data){
      this.socket.emit("mahjiong", data)
    },
    restart:function(arg){
      console.log(arg)//good arg=self
      this.inTurn=this.mySeat,
     this.users.forEach((e,i)=>i===this.self
     ?e.dealer=true:e.dealer=false), 
         this.goAhead.fill(false), 
         this.goAhead[this.self]=true,
         this.socket.emit('restart', 
         [this.users, this.goAhead, this.inTurn])
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

    // findMyRank: function(rank) {
    //   switch (rank) {
    //     case 0:
    //       this.myRank = "first";
    //       break;
    //     case 1:
    //       this.myRank = "second";
    //       break;
    //     case 2:
    //       this.myRank = "third";
    //       break;
    //     case 3:
    //       this.myRank = "last";
    //   }
    //   return this.myRank;
    // },

    award:function(rank){
      let a=['first','second','third','last'];
      for(let i = 0; i < 4; i++){
        rank[i].n = a[i]
      }
      return rank//ranked one awarde "first"...
    },//rank[0].a=player's index, .t=number diced, .n="first"
    
    //t: tileSort of discarded
    tileScaner: function (tile, t){
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
}
.right {
  display:flex;
  flex-flow: column;
  grid-area: right;
  align-self: start;
  z-index: 1;
}
.center {
  display:flex;
  font-size: max(2vw, 20px);
  grid-area: center;
  justify-self: center;
  align-self: start;
}
.self {
  grid-area: self;
  display: flex;
  justify-self: center;
  align-self: start;
}

 .container {
  display: grid;
  /* font-size: 1.5rem; */
  /* place-content: center; */
  /* grid-template-columns:  1fr ;
  grid-template-rows: 1fr; */
  grid-template-areas:
    "left cross right"
    /* "left center right" */
    "left center right"
    /* "left self right" */
    "left self right";
  background-color: rgba(rgb(243, 171, 171), rgb(239, 245, 239), rgb(212, 212, 231), 0.4);
}

@media screen and (max-width: 400px) {
  .container {
    grid-template-columns: auto 1fr auto;
    /* grid-template-rows: 1fr 1fr 1fr; */
    /* grid-template-areas:
      "cross cross cross"
      ".center."
      "left center right"
      "left self right"; */
  }
}
</style>
