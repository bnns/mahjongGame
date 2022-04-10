<template>
  <div>
    <button class='logins' ref="logins" @click="logins()" v-if="stage===1&&!signUp">
      <h1>{{ msg }}</h1>
    </button>
    <div class="input" v-else-if="stage===2&&!signUp">
       <div class='label'>{{'User Name'}}</div>
       <select ref='signInName' v-model='username' @change="logins2()">
          <option v-for="user in users" v-bind:key="user.id" >{{ user.name }}</option>
       </select>
      <!-- <input v-model="username" ref="name" autocomplete="false"
      v-on:keyup.enter="submit()" /><br /> -->
      <!-- <h2>Room:</h2>
      <input v-model="roomName" ref="room"  autocomplete="false"
      v-on:keyup.enter="submit()" /> -->
    </div>
    <div v-else-if="stage===3">
      <h2 class="text">{{"Wait "}}
        {{4-(counter===0?4:counter)}}
        {{" "}}more people</h2>
    </div>

    <div class="new_account center" @click="sign_up()" 
    v-if="stage===1&&!signUp">Sign up</div>
    <form class='center' autocomplete="off" action="/action_page.php" 
    v-if="signUp&&stage!==3">
          <input ref="userName" type="text" name="name" 
           autocomplete="off" placeholder='user name'><br>
          <input ref="roomName" type="text" name="room"  placeholder='room name'><br>
         
          <input type="password" ref="pwd" name="password"
          placeholder="4-pin" maxlength="4">
           <input type="password" ref="re_pwd" name="password"
          placeholder="re_pin" maxlength="4" v-show="repin">
          <button id='sendForm'  type="button" value="Submit" @click="submit()">
          {{'Submit'}}</button>
    </form>
  </div>
</template>

<script>
export default{
  name:"Login",
  props:["counter","name",'myId','roomId',"rmName", "mySocketId", "room"],
  data(){
    return{
      username:this.name,
      roomName:this.rmName,
      users:this.room?[this.room.users]:[],
      msg:"",
      stage:1,
      repin:false,
      signUp:false,
    };
  },
  watch:{
    username:function(newVal){
      this.roomName = newVal+"'s room"
      return newVal;
    },
    rmName:function(newVal){
      this.roomName=newVal
     // return newVal;
    },
    room:function(newVal){
      console.log(newVal, 'watch')
      this.users=this.room.users
      return newVal
    }
  },

  methods:{
    next(){
        this.$refs.room.focus();
    },
    logins:function(){
      this.stage=2;
        this.signUp=false;
         if(!this.signUp){this.$emit("signIn", ['room', this.roomName])}
    },
    logins2:function(){
      console.log(this.username, ' / logins2')
      this.$emit('signIn', ['name', this.roomName, this.username])
      this.stage=3
    },
    submit(){
      this.repin=!this.repin
       this.$refs.re_pwd.focus();
      if(this.$refs.pwd.value===this.$refs.re_pwd.value)
      {''}
      else
        { 
        this.repin=true; this.$refs.re_pwd.value='';
        this.$refs.re_pwd.placeholder="re_pin";
        this.$nextTick(() => {this.$refs.re_pwd.focus()}); 
        return
        }
     // console.log('submit', this.username, ' / ', this.$refs.pwd.value)
      if(this.signUp&&!this.repin){
         this.username=this.$refs.userName.value
         this.roomName=this.$refs.roomName.value
         this.$emit('signUp', [this.username, this.roomName, 'pwd'])}
      !this.repin?this.stage = 3:'';
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
#sendForm{
   width: 40%;
   margin: 15px;
   color:black;
   background-color: rgb(89, 207, 9);
   border-radius: 15px;
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
input, select {
  height: 40px;
  width: 80%;
  font-size: larger;
  color: white;
  background-color: black;
  text-align:center;
  border-radius:50%;
  opacity:0.6;
}
 select {
  height: 40px;
  width: 100%;
  font-size: large;
  color: white;
  background-color: black;
  text-align:center;
  border-radius:50%;
  opacity:0.6;
}
.logins {
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
.label{
   font-size: 2rem;
  background: linear-gradient(to right,
     #303dd0 0% 15%, rgb(32, 206, 16) 35% 60%,
      #8f54d8 70% 80%, red 100%);
  color: rgba(255,255,255,0);/*a make transparent*/
  background-clip: text;  /*2 work together*/
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;/*not neccearry*/
}
</style>
