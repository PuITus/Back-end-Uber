<template>
  <div id="app">

  <!-- the router outlet, where all matched components would ber viewed -->
<!--   <router-link v-bind:to="'/'">Home</router-link>
<router-link v-bind:to="'/uber'">Uber</router-link>
<router-link v-bind:to="'/login'">Login</router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>
<!-- styling for the component -->
<style >
body{

	background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
	background-size: 400% 400%;
	-webkit-animation: Gradient 15s ease infinite;
	-moz-animation: Gradient 15s ease infinite;
	animation: Gradient 15s ease infinite;

}

@-webkit-keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@-moz-keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

#user-box
{
background: #fff;
            border: #DCDBD7 1px solid;
            border-radius: 10px; z-index:99;    position: fixed; right:10px; top: 10px;
}  

</style>
