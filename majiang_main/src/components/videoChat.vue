<template>
  <div class="container">
    <video ref="video" width="320" height="240" controls autoplay></video>
  </div>
</template>
<script type="text/javascript">
import io from "socket.io-client";
//import {mapActions} from 'vuex';
export default {
  name: "videoChat",
  props: ["self", "right", "cross", "left", "name"],
  data() {
    return {
      // diceNumber:this.dices,
      //video: {},
      disabled: false,
      seat: "",
      seatId: 0,
      socket: io("http://192.168.1.76:3000"),
      guide: ["Please dice it...", "Dicing...", "Sitting..."],
      index: 0,
      stages: 0,
      //timing:null,
      classC: "-center",
      classS: "-self",
      seats: [true, true, true, true],
    };
  },

  async created() {
    //function () {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      let constraints = {
        video: {
          width: { min: 1280 },
          height: { min: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.$refs.video;
      //const video = document.querySelector('video');
      video.srcObject = stream;
    }
  },
  //	getDevices: async function () {
  //const devices = await navigator.mediaDevices.enumerateDevices();
  //	}
  // }
  //function(error){window.console.log(error);});
};
</script>
<style scoped>
img {
  max-height: 58px;
}
.container {
  position: absolute;
  display: inline-flexbox;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
  height: 85vh;
  width: 90vw;
  align-self: left;
}
.-self {
  grid-column: 9/-1;
  grid-row: 9/-1;
  animation: mymove1 3s infinite;
  background-color: gray;
  align-items: center;
}
@keyframes mymove1 {
  from {
    background-color: red;
  }
  to {
    background-color: gray;
  }
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
  from {
    background-color: yellow;
  }
  to {
    background-color: red;
  }
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
