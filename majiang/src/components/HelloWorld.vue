<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png">
		<video autoplay></video>
	</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'app',
  components: {
    HelloWorld
  }
	name: 'app',
	components: {},
	data: function () {
		return {
			stream: null
		}
	},
	methods: {
		init: async function () {
			// if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
			// 	let constraints = {
			// 		video: {
			// 			width: { min: 1280 },
			// 			height: { min: 720 }
			// 		},
			// 	};
			// 	const stream = await navigator.mediaDevices.getUserMedia(constraints);
			// 	const video = document.querySelector('video');
			// }
		},
		getDevices: async function () {
			// const devices = await navigator.mediaDevices.enumerateDevices();
		}
	},
	beforeMount: function () {
		this.init();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
