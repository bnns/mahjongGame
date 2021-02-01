<template>
	<div id="app">
		<video ref="video" autoplay></video>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {},
	data: function () {
		return {
			stream: null
		}
	},
	methods: {
		init: async function () {
			if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
				let constraints = {
					video: {
						width: { min: 1280 },
						height: { min: 720 }
					},
				};
				const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = this.$refs.video
        //const video = document.querySelector('video');
        video.srcObject = stream
			}
		},
		getDevices: async function () {
			//const devices = await navigator.mediaDevices.enumerateDevices();
		}
	},
	beforeMount: function () {
		this.init();
	}
}
</script>

<style>
video {
	width: 100%;
	background: rgba(0, 0, 0, 0.2);
}
</style>
