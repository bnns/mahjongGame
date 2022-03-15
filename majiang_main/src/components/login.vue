<template>
  <div>
    <button ref="logins" @click="logins()" v-if="stage===1">
      <h1>{{ msg }}</h1>
    </button>
    <div class="input" v-else-if="stage===2">
      <h2>Your name:</h2>
      <input v-model="username" ref="name" v-on:keyup.enter="submit()" /><br />
      <h2>Room number:</h2>
      <input v-model="roomId" placeholder="default" />
    </div>
    <div v-else-if="stage===3">
      <h2 class="text">{{"Wait "}}
        {{4-(counter===0?4:counter)}}
        {{" "}}more people</h2>
    </div>
  </div>
</template>

<script>
export default{
  name:"Login",
  props:["counter","name",'myId','roomId',"mySocketId"],
  data(){
    return{
      roomNumb:this.roomId,
      username:this.name+`${this.counter}`,
      user:{},
      msg:"",
      stage:1,
    };
  },
  watch:{
    username:function(newVal){
      return newVal;
    },
    roomId:function(newVal){//??????????????????
      this.roomNumb=newVal;
    }
  },
  // computed:{
  //   username:function(){
  //     return this.name+`${this.counter}`;
  //   },
  //},

  methods:{
    setFocus(){
      this.$nextTick(()=>{
        this.$refs.name.focus();
      });
    },
    logins:function(){
      this.stage=2;
      this.setFocus();
    },
    submit(){
      this.user.loggedIn = true;
      this.user.name = this.username;
      this.user.userId= this.myId;
      this.user.index = this.counter - 1;
      this.user.socketId = this.mySocketId;
      this.user.roomId = this.roomNumb;
      this.$emit("clicked", this.user);
      this.stage = 3;
    },
  },

  created: function() {
    this.msg = `Click to join Mahjong!`;
    this.$nextTick(() => {
      this.$refs.logins.focus();
    });
  },
};
</script>
<style scoped>
.input{
  display:flex;
  flex-direction:column;
  align-items:center;
}
h2{
  margin:0px;
  color: linear-gradient(to left rgb(106, 168, 12), pink, yellow);
}
input {
  height: 40px;
  width: 80%;
  font-size: larger;
  color: white;
  background-color: black;
  text-align:center;
  border-radius:50%;
  opacity:0.6;
}
button {
  height: 100%;
  background:conic-gradient(red, yellow, green, pink, red );
  border-radius: 20px;
  padding: 0 !important;
  border: solid 15px transparent;
  border-color : transparent;
  opacity:0.7;
}
button:focus {
    outline: none;
}
.text {
  font-size: 4rem;
  /* background:radial-gradient(circle at 50%,
  #4830d0, rgb(68, 43, 206), #c51f14, rgb(149, 48, 153),
  yellow,rgb(31, 102, 207)); */
  background: linear-gradient(to right,
     #30d058 0% 15%, rgb(35, 16, 206) 35% 60%,
      #8f54d8 70% 80%, red 100%);
  color: rgba(255,255,255,0);/*a make transparent*/
  background-clip: text;  /*2 work together*/
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;/*not neccearry*/
} 
</style>
