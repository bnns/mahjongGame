<template >
  <div class="container">
  <div :class="classS" v-if="stages===0" >
    <img :src="require(`../assets/${diceNumber[self]}.png`)"
    alt="Image lost..."
    v-on:click="myAction(`${self}`)"
     />
  </div>
  <div class="-right" v-if="stages===0" >
    <img :src="require(`../assets/${diceNumber[right]}.png`)" alt="Image lost..."
      />
  </div>
  <div class="-cross" v-if="stages===0" >
    <img :src="require(`../assets/${diceNumber[cross]}.png`)" alt="Image lost..." />
  </div>
  <div class="-left" v-if="stages===0" >
    <img :src="require(`../assets/${diceNumber[left]}.png`)" alt="Image lost..." />
  </div>
  <div :class="classC" v-if="stages===0">
    {{guide[index]}}
  </div>
  <div class="-self" v-if="stages===1">
    <h1 v-show='!East'></h1>
    <img src="../assets/east_wind.png" alt="Direction" @click="action('East', 0)" v-show="seats[0]"/>
  </div>
  <div class="-right" v-if="stages===1">
    <img src="../assets/north_wind.png" alt="Direction" v-on:click="action('North', 1)" v-show="seats[1]"/>
  </div>
  <div class="-cross" v-if="stages===1">
    <img src="../assets/west_wind.png" alt="Direction" v-on:click="action('West', 2)" v-show="seats[2]"/>
  </div>
  <div class="-left" v-if="stages===1">
    <img src="../assets/south_wind.png" alt="Direction" v-on:click="action('South', 3)" v-show="seats[3]"/>
  </div>
  <div class="-center" v-if="stages===1">
    {{guide[index]}}
  </div>
  <div id="casting" v-else-if="stages===2">
    <svg class="table" width="60vw" height="50vh" style="background-color:rgb(225, 220, 200)">RED
    </svg>
  </div>
</div>
</template>
<script type="text/javascript">
  import io from "socket.io-client"
  import {mapActions} from 'vuex'

  export default {
  name: 'center',
  props: ['self', 'right', 'cross', 'left', 'dices', 'name'],
  data (){
    return {
      // diceNumber:this.dices,
      disabled: false,
      seat: '',
      seatId: 0,
     socket: io("http://192.168.1.76:3000"),
      guide: ["Please dice it...", "Dicing...", "Sitting..."],
      index: 0,
      stages: 0,
      //timing:null,
      classC:'-center',
      classS:'-self',
      seats:[
            true,
            true,
            true,
            true
            ]
           }
         },
   computed: {
     diceNumber:function(){return this.dices}
      // ...mapGetters([
      //   'getDicedNumber'
      // ]),
   },
    methods: {
      // ...mapActions([
      // 'setluckyNumber']),

        action: function(data, data1){
          this.seats.fill(false)
          this.seat=data
          this.seatId = data1
        this.socket.emit('changed', {data, data1})//seat selected
        },
        myAction: function(){
          this.doDicing()
        },
        doDicing: function(){
          if(this.disabled){
            alert('disabled')
            return}
          //this.disabled=true
          let v = this
          let i = 0
          let timing = setInterval(() => {
            i++
        let a = v.getRandomizer(0, 5)
        let arg = [v.self]
        arg.push(a+1)
        this.$emit('change', arg)
        this.socket.emit('diceChange', arg)//emit to Server
        // v.setluckyNumber(arg)//talk with data store
          if (i > 20){
          //  this.socket.emit('finished', v.self)//tell server done
            clearInterval(timing)}
      }, 700)
     },
     diced(){
       this.diceNumber=[]
       this.diceNumber=this.dices
     },
      getRandomizer: function (bottom, top){
      let  number = Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
      return number
    },
    created() {
      this.socket.on('luckyNumber', ()=>{
        this.diced()
        this.stages++
        this.socket.on('allDiced', ()=>{
          this.classC='-centerN'
          this.classS='-selfN'
          this.stages++
        })
      }),
      this.socket.on('selected', data=>{
        this.seats.splice(data, 1, false)
      }),
      window.console.log('startTiles')//this.startTiles();??????????????
    },
}
</script>
<style scoped>
   img {
     max-height: 58px;
   }
   .container{
    displag: grid;
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
   from {background-color: red;}
   to {background-color: gray;}
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
     background-color: blue;
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
   @keyframes mymove {
   from {background-color: yellow;}
   to {background-color: red;}
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
