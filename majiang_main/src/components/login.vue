<template>
  <div>
    <button ref="logins" @click="logins()" v-if="stage===1&&!signUp">
      <h1>{{ msg }}</h1>
    </button>
    <div class="input" v-else-if="stage===2&&!signUp">
      <h2>Name:</h2>
      <input v-model="username" ref="name" v-on:keyup.enter="next()" /><br />
      <h2>Room:</h2>
      <input v-model="roomName" ref="room" v-on:keyup.enter="submit()" />
    </div>
    <div v-else-if="stage===3">
      <h2 class="text">{{"Wait "}}
        {{4-(counter===0?4:counter)}}
        {{" "}}more people</h2>
    </div>

    <div class="new_account center" @click="sign_up()" 
    v-if="stage===1&&!signUp">Sign up</div>
    <form class='center' action="/action_page.php" 
    v-if="signUp&&stage!==3">
          <input ref="userName" type="text" name="name"  placeholder='user name'><br>
          <input ref="roomName" type="text" name="room"  placeholder='room name'><br>
         
          <input type="password" ref="pwd" name="pwd" placeholder="password" minlength="6">
          <input class='sendForm'  type="button" value="Submit" @click="submit()">
    </form>
  </div>
</template>

<script>
export default{
  name:"Login",
  props:["counter","name",'myId','roomId',"mySocketId"],
  data(){
    return{
      username:this.name,
      roomName:this.name+"'s room",
      user:{},
      msg:"",
      stage:1,
      signUp:false,
    };
  },
  watch:{
    username:function(newVal){
      this.roomName = newVal+"'s room"
      return newVal;
    },
    roomName:function(newVal){
      return newVal;
    }
  },

  methods:{
    next(){
        this.$refs.room.focus();
    },
    logins:function(){
      this.stage=2;
       this.$nextTick(()=>{
        this.$refs.name.focus();
        this.signUp=false;
      });
    },
    submit(){
      this.username=this.$refs.userName.value
      this.roomName=this.$refs.roomName.value
      console.log('submit', this.username, ' / ', this.$refs.pwd.value)
      if(!this.signUp){this.$emit("signIn", [this.username, this.roomName])}
      else{this.$emit('signUp', [this.username, this.roomName, 'pwd'])}
      this.stage = 3;
    },
    sign_up(){
      this.signUp=true
    }
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
form{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
.sendForm{
   width: 50%;
   color:white;
   background-color: black;
}
.new_account{
  /* display: flex; */
  justify-content: center;
  align-items: center;
  color:yellow;
  height: 30%;
  font-size: 2rem;
  margin: 1rem;
  background:radial-gradient(
    rgb(206, 48, 48),
    rgb(51, 88, 167),
   rgb(210, 231, 113),
    rgb(196, 15, 115));
  border-radius: 45%;
}
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
  height: 70%;
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
