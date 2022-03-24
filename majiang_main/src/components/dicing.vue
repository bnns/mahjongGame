<template>
  <div class="container">
    <div class="-self" v-on:click="myAction(`${self}`)">
       <div class="myblock">
        <img
          :src="require(`../assets/${diceNumber[self][0]}.png`)"
          alt="Image lost..."
        />
        <img
          :src="require(`../assets/${diceNumber[self][1]}.png`)"
          alt="Image lost..."
        />
      </div>
      <div class="myblock">
        <img
          :src="require(`../assets/${diceNumber[self][2]}.png`)"
          alt="Image lost..."
        />
        <img
          :src="require(`../assets/${diceNumber[self][3]}.png`)"
          alt="Image lost..."
        />
      </div>
       <h3>{{this.diceTotal[self]}}</h3>
       <div class="name">{{users[self].name}}</div>
        <h3 class='keep_dicing' v-if="!disabled">{{'keep dicing...!'}}</h3>
    </div>
    <div class="-right">
      <div>
        <img
          :src="require(`../assets/${diceNumber[right][0]}.png`)"
          alt="Image lost..."
        />
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
        <img
          :src="require(`../assets/${diceNumber[right][3]}.png`)"
          alt="Image lost..."
        />
      </div>
      <h3>{{ this.diceTotal[right] }}</h3>
      <div class="name">{{users[right].name}}</div>
    </div>
    <div class="-cross">
      <div>
        <img
          :src="require(`../assets/${diceNumber[cross][0]}.png`)"
          alt="Image lost..."
        />
  
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
        <img
          :src="require(`../assets/${diceNumber[cross][3]}.png`)"
          alt="Image lost..."
        />
      </div>
      <h3>{{this.diceTotal[cross]}}</h3>
      <div class="name">{{users[cross].name}}</div>
    </div>
    <div class="-left">
      <div>
        <img
          :src="require(`../assets/${diceNumber[left][0]}.png`)"
          alt="Image lost..."
        />
     
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
     
        <img
          :src="require(`../assets/${diceNumber[left][3]}.png`)"
          alt="Image lost..."
        />
       </div>
       <h3>{{this.diceTotal[left]}}</h3>
       <div class="name">{{users[left].name}}</div>
    </div>
    <div class="-center">
         {{guide[index]}}
    </div>
</div>
</template>

<script type="text/javascript">

export default {
  name: "Dicing",
  props:{
    self:{
      type:Number,
      required:true,
    },
    right:{
      type:Number,
      required:true,
    },
    cross:{
      type:Number,
      required:true,
    },
    left:{
      type:Number,
      required:true,
    },
    dices:{//self created when start??????????
      type:Array,
      required:true,
    },
    name:{
      type:String,
      required:true,
    },
    users:{},
    diceTotal:{
      type:Array,
      required:true,
    },
    disabled:{
      type:Boolean,
      required:true,
    },
    index:{
      type:Number,
      required:true,
    },
  },
  data(){
    return{
      //diceNumber:this.dices,
      guideIndex:this.index,
      selected:null,
      seatId:0,
      guide:["Dice here...", "Dicing...", "Pick seat..."],
    };
  },

  computed:{
    diceNumber:function(){//?????????????
      return this.dices;
    },
  },

  methods:{
    myAction:function(){
        this.doDicing();
    },
    doDicing:function(){
      if(this.disabled){
        alert("disabled");//???????????????
        return;
      }
      let i=0;
      let timing=setInterval(()=>{
        i++;
        let arg=[this.self];
        let aGroup=[];
        for(let k=0; k<4; k++){
          let a=this.getRandomizer(1, 6);
          aGroup.push(a);
        }
        arg.push(aGroup);//[self, diced numbers]
        //this.diceTotal = aGroup.reduce((accu, el) => accu + el);
        this.$emit("change", arg);
        if(i>20){
          clearInterval(timing);
          this.$emit("diced", arg);
        }
      }, 700);
    },

    diced(){
       this.diceNumber=[];
       this.diceNumber=this.dices;
    },

    getRandomizer:function(bottom, top){
      let number=Math.floor(Math.random()*(1+top-bottom))+bottom;
      return number;
    },
  },
};
</script>

<style scoped>
* {
  top: 0;
  left: 0;
  box-sizing: border-box;
}
img {
  max-height: 68px;
  border-radius: 15px;
}
.container {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
  height: 85vh;
  width: 90vw;
}
.-self {
  grid-column: 9/-1;
  grid-row: 9/-1;
  display:flex;
  position:relative;
  padding: 18%;
  flex-wrap: wrap;
  height: 100%;
  width:100%;
  animation: mymove1 3s infinite;
  background-color: gray;
  align-content: center;
  justify-content: center;
}

h3{
  display:flex;
  justify-content:center;
  align-items:center; 
  border-radius:50%;
  /* height:2rem;
  width:2rem; */
  /* background-size: 2rem; */
  background-color: lightblue;
}
.keep_dicing{
  background-color:gray;
  color:yellow;
}
.-self.name{
  right:1px;
  bottom:1px;
  background-color: deeppink;
}
@keyframes mymove1 {
  from {
    background-color: red;
  }
  to {
    background-color: gray;
  }
}
.-right {
  grid-column: 9/-1;
  grid-row: 1/9;
  height: 100%;
  width:100%;
  display: flex;
  flex-wrap: wrap;
  padding: 18%;
  background-color: pink;
  align-content: center;
  justify-content: center;
}
.-right.name{
  right:1px;
  top:1px;
  background-color: deeppink;
}
.-cross {
  grid-column: 1/9;
  grid-row: 1/9;
   height: 100%;
  width:100%;
  display: flex;
  flex-wrap: wrap;
  padding:18%;
  background-color: rgb(202, 245, 133);
  align-content: center;
  justify-content: center;
}
.-left {
  grid-column: 1/9;
  grid-row: 9/-1;
   height: 100%;
  width:100%;
   display: flex;
   flex-wrap: wrap;
   padding:18%;
  background-color: yellow;
  align-content: center;
  justify-content: center;
}
.-center {
  grid-column: 7/11;
  grid-row: 7/11;
  display: inline-flex;
  animation: mymove 3s infinite;
  border-radius: 15px;
  background: darkgreen;
  color: white;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  z-index: 5;
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
/* .-centerN {
  grid-column: 7/11;
  grid-row: 7/11;
  background: darkgreen;
  color: white;
  align-items: center;
  justify-content: center;
} */
.-self:hover{
    cursor: pointer;
}
/* .container > div {
  display: flex;
  justify-content: center;
  border-radius: 15px;
  flex-wrap: wrap;
} */
@media only screen and (max-width: 400px) {

  .container>div {
    flex-direction: column;
  }
}
</style>
