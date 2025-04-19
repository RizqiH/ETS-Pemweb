<script lang="ts">
	import '../app.css';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Navbar from '../lib/components/Navbar/Navbar.svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Questrial&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Navbar />
<main class="flex-grow">
	{@render children()}
</main>

<Footer />
