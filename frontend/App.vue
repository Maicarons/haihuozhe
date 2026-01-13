<script>
	import CustomNavBar from '@/components/custom-nav-bar/custom-nav-bar.vue';
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalComponents: {
			CustomNavBar
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>