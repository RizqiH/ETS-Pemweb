<script lang="ts">
	// You can add props for customization if needed
	export let heroImage = 'images/1,2.jpg';
	export let heroTitle = 'BEST SELLERS';
	export let heroButtonText = 'SHOP NOW';
	export let heroButtonLink = '/shop';
</script>

<div
	class="position-relative vh-100 overflow-hidden"
	style="background-image: url('{heroImage}'); background-size: cover; background-position: center;"
>
	<div class="position-absolute bg-dark start-0 top-0 h-100 w-100" style="opacity: 0.1;"></div>

	<!-- Slot for the navbar - this allows you to include the navbar in the hero section -->
	<slot name="navbar"></slot>

	<!-- Hero content -->
	<div class="position-relative container h-100">
		<div class="position-absolute" style="bottom: 100px; left: 50px;">
			<h1 class="display-3 fw-bold mb-4 text-white">{heroTitle}</h1>
			<a href={heroButtonLink} class="btn btn-outline-light px-4 py-2">
				{heroButtonText} <span class="ms-2">→</span>
			</a>
		</div>
	</div>
</div>
