<template>
  <div>
    <button ref="logins" @click="logins()" v-if="stage === 1">
      <h1>{{ msg }}</h1>
    </button>
    <div v-else-if="stage === 2">
      <h2>Please enter your name:</h2>
      <input v-model="username" ref="name" v-on:keyup.enter="submit()" /><br />
      <h2>Room number if desired:</h2>
      <input v-model="roomId" placeholder="default" />
    </div>
    <div v-else-if="stage === 3">
      <h2>{{ 4 - (counter===0?4:counter) }} more people needed</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  props: ["counter", "name", 'roomId', "mySocketId"],
  data() {
    return {
      roomNumb: this.roomId,
      user: {},
      msg: "",
      stage: 1,
    };
  },
  watch: {
    counter: function(newVal) {
      return newVal;
    },
    roomId: function(newVal){
      this.roomNumb = newVal;
    }
  },

  computed: {
    username: function() {
      return this.name + `${this.counter}`;
    },
  },

  methods: {
    setFocus() {
      this.$nextTick(() => {
        this.$refs.name.focus();
      });
    },

    logins: function() {
      this.stage=2;
      this.setFocus();
    },

    submit() {
      this.user.loggedIn = true;
      this.user.name = this.username;
      this.user.index = this.counter - 1;
      this.user.socketId = this.mySocketId;
      this.user.roomId = this.roomNumb;
      this.$emit("clicked", this.user);
      this.stage = 3;
    },
  },

  created: function() {
    this.msg = `Click here to join Mahjiong Game!`;
    this.$nextTick(() => {
      this.$refs.logins.focus();
    });
  },
};
</script>

<style scoped>
h2 {
  color: black;
}
input {
  height: 40px;
  font-size: 2rem;
  color: rgb(241, 226, 226);
  background-color: black;
}
button {
  background-color: yellow;
}
</style>
