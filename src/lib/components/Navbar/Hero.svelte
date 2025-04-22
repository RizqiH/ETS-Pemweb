<script lang="ts">
	export let heroImage = 'images/1,2.jpg';
	export let heroTitle = 'BEST SELLERS';
	export let heroButtonText = 'SHOP NOW';
	export let heroButtonLink = '/shop';
</script>

<div class="position-relative vh-100 overflow-hidden">
	<div class="hero-image" style="background-image: url('{heroImage}');"></div>
	<div class="position-absolute bg-dark start-0 top-0 h-100 w-100" style="opacity: 0.1;"></div>
	<slot name="navbar"></slot>
	<div class="hero-content container h-100">
		<div class="position-absolute" style="bottom: 100px; left: 50px;">
			<h1 class="display-3 fw-bold mb-4 text-white">{heroTitle}</h1>
			<a href={heroButtonLink} class="btn btn-outline-light px-4 py-2 hero-button">
				{heroButtonText} <span class="ms-2">→</span>
			</a>
		</div>
	</div>
</div>

<style>
	@keyframes fadeInZoom {
		0% {
			opacity: 0;
			transform: scale(1.2);
		}
		100% {
			opacity: 1;
			transform: scale(1); 
		}
	}

	@keyframes buttonZoomIn {
		0% {
			opacity: 0;
			transform: scale(1.1);
		}
		100% {
			opacity: 1;
			transform: scale(1); 
		}
	}

	.hero-image {
		animation: fadeInZoom 0.5s ease-out; 
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-size: cover;
		background-position: center;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		opacity: 0;
		transform: translateY(30px); 
		animation: fadeInZoom 1s ease-out forwards;
		animation-delay: 0.5s; 
	}

	.hero-content h1,
	.hero-content a {
		animation: fadeInZoom 2s ease-out forwards;
	}
	.hero-content a {
		animation-delay: 1s;
		animation: buttonZoomIn 1s ease-out forwards;
	}

	.hero-button {
		position: relative;
		overflow: hidden;
		background-color: transparent;
		color: #fff;
		border: 2px solid #fff;
		text-decoration: none;
		transition: color 0.4s;
		z-index: 1;
	}

	.hero-button::before {
		content: '';
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		transition: top 0.4s ease;
		z-index: -1;
	}

	.hero-button:hover::before {
		top: 0;
	}

	.hero-button:hover {
		color: #000000;
		transform: scale(1.1);
		transition: transform 0.2s ease;
	}

	.hero-button span {
		position: relative;
		z-index: 2;
	}
</style>
