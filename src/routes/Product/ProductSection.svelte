<script lang="ts">
	import './ProductSection.css';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { onMount } from 'svelte';
	import { getProducts } from '$lib/firebase/firebase';

	type Product = {
		id: string;
		name: string;
		price: number;
		image: string | null;
		sizes: string[];
		availableSizes: string[];
		category: string;
	};

	let products: Product[] = [];
	let filteredProducts: Product[] = [];
	let loading = true;
	let error = false;
	let currentSlide = 0;
	let itemsPerSlide = 4; // Default value, will be adjusted based on screen size
	let selectedCategory = '';
	let selectedSize: Record<string, string> = {};
	let touchStartX = 0;
	let touchEndX = 0;

	let windowWidth = 0;

	// Update items per slide based on screen width
	$: {
		if (windowWidth < 576) { // xs screens
			itemsPerSlide = 1;
		} else if (windowWidth < 768) { // sm screens
			itemsPerSlide = 2;
		} else if (windowWidth < 992) { // md screens
			itemsPerSlide = 3;
		} else { // lg and above
			itemsPerSlide = 4;
		}
	}

	// Fetch products from backend
	onMount(async () => {
		try {
			loading = true;
			windowWidth = window.innerWidth;
			const fetchedProducts = await getProducts();
			products = fetchedProducts.slice(0, 10);
			filteredProducts = products;
			loading = false;
		} catch (err) {
			console.error('Failed to fetch products:', err);
			loading = false;
			error = true;
		}
	});

	// Filter products based on selected category
	function filterByCategory(category: string): void {
		selectedCategory = category;

		if (category === 'Hoodie' || category === 'Sweatshirt') {
			filteredProducts = products.filter((product) => product.category.includes(category));
		} else {
			filteredProducts = products;
		}
		
		// Reset to first slide when changing categories
		currentSlide = 0;
	}

	// Format price to IDR
	function formatPrice(price: number): string {
		return `IDR ${price.toLocaleString('id-ID')}`;
	}

	// Handle size selection
	function selectSize(productId: string, size: string): void {
		selectedSize[productId] = size;
	}

	// Handle resize for responsiveness
	function handleResize() {
		windowWidth = window.innerWidth;
		
		// Make sure currentSlide is still valid after resize
		const maxSlides = Math.ceil(filteredProducts.length / itemsPerSlide) - 1;
		if (currentSlide > maxSlides) {
			currentSlide = maxSlides < 0 ? 0 : maxSlides;
		}
	}

	function nextProductSlide() {
		const maxSlides = Math.ceil(filteredProducts.length / itemsPerSlide) - 1;
		currentSlide = currentSlide >= maxSlides ? 0 : currentSlide + 1;
	}

	function prevProductSlide() {
		const maxSlides = Math.ceil(filteredProducts.length / itemsPerSlide) - 1;
		currentSlide = currentSlide <= 0 ? maxSlides : currentSlide - 1;
	}

	// Touch handlers for swipe on mobile
	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchMove(e: TouchEvent) {
		touchEndX = e.touches[0].clientX;
	}

	function handleTouchEnd() {
		const minSwipeDistance = 50;
		const swipeDistance = touchEndX - touchStartX;
		
		if (swipeDistance > minSwipeDistance) {
			prevProductSlide(); // Swipe right
		} else if (swipeDistance < -minSwipeDistance) {
			nextProductSlide(); // Swipe left
		}
	}

	// Show only current slide's products
	$: visibleProducts = filteredProducts.slice(
		currentSlide * itemsPerSlide,
		Math.min((currentSlide + 1) * itemsPerSlide, filteredProducts.length)
	);

	// Calculate total number of slides
	$: totalSlides = Math.ceil(filteredProducts.length / itemsPerSlide);
</script>

<svelte:window on:resize={handleResize} />

<section class="products-section position-relative py-3 py-md-5">
	<div class="container-fluid px-2 px-sm-4">
		<!-- Filter Buttons -->
		<div class="d-flex mb-3 mb-md-4 justify-content-center justify-content-md-start">
			<span
				class="hover-underline me-3 {selectedCategory === 'Hoodie' ? 'active' : ''}"
				style="color: Black; cursor: pointer; font-size: clamp(14px, 3vw, 16px);"
				on:click={() => filterByCategory('Hoodie')}
			>
				Hoodie
			</span>
			<span
				class="hover-underline me-3 {selectedCategory === 'Sweatshirt' ? 'active' : ''}"
				style="color: black; cursor: pointer; font-size: clamp(14px, 3vw, 16px);"
				on:click={() => filterByCategory('Sweatshirt')}
			>
				Sweatshirt
			</span>
			<span
				class="hover-underline {!selectedCategory ? 'active' : ''}"
				style="color: black; cursor: pointer; font-size: clamp(14px, 3vw, 16px);"
				on:click={() => filterByCategory('')}
			>
				Semua
			</span>
		</div>

		{#if loading}
			<div class="py-5 text-center">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-2">Memuat produk dari database...</p>
			</div>
		{:else if error || filteredProducts.length === 0}
			<div class="alert alert-warning text-center" role="alert">
				{error ? 'Gagal memuat produk dari database.' : 'Tidak ada produk untuk ditampilkan.'}
			</div>
		{:else}
			<!-- Navigation Arrows -->
			<div class="carousel-navigation-container">
				<button
					class="carousel-nav-arrow carousel-nav-prev"
					on:click={prevProductSlide}
					aria-label="Previous products"
				>
					<span class="arrow-icon">&#10094;</span>
				</button>

				<div class="carousel-indicators d-flex justify-content-center my-2">
					{#each Array(totalSlides) as _, i}
						<span 
							class="carousel-dot {i === currentSlide ? 'active' : ''}" 
							on:click={() => currentSlide = i}
						></span>
					{/each}
				</div>

				<button
					class="carousel-nav-arrow carousel-nav-next"
					on:click={nextProductSlide}
					aria-label="Next products"
				>
					<span class="arrow-icon">&#10095;</span>
				</button>
			</div>

			<div 
				class="product-carousel"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div 
					class="carousel-track" 
					style="transform: translateX(-{currentSlide * 100}%); transition: transform 0.4s ease;"
				>
					{#each Array(Math.ceil(filteredProducts.length / itemsPerSlide)) as _, slideIndex}
						<div class="carousel-slide">
							<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-4">
								{#each filteredProducts.slice(slideIndex * itemsPerSlide, Math.min((slideIndex + 1) * itemsPerSlide, filteredProducts.length)) as product, i}
									<div class="col">
										<div class="product-card h-100" style="animation-delay: {i * 0.15}s">
											<a href="/product/{product.id}" class="text-decoration-none text-dark">
												<div class="product-image-container mb-2 mb-md-3">
													<img
														src={product.image || 'default-image.jpg'}
														alt={product.name}
														class="product-image w-100"
														loading="lazy"
													/>
												</div>
												<h3 class="product-title mb-1">{product.name}</h3>
												<p class="product-price mb-2">{formatPrice(product.price)}</p>
											</a>
											
											<!-- Size Selection - Responsive Layout -->
											<div class="size-selection mt-1">
												<div class="d-flex flex-wrap gap-1">
													{#each product.sizes as size}
														{@const isAvailable = product.availableSizes.includes(size)}
														<button
															class="size-indicator {isAvailable ? 'available' : 'unavailable'} {selectedSize[product.id] === size ? 'selected' : ''}"
															disabled={!isAvailable}
															on:click={() => isAvailable && selectSize(product.id, size)}
														>
															{size}
														</button>
													{/each}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes slide-up {
		0% {
			opacity: 0;
			transform: translateY(50px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.product-card {
		opacity: 0;
		transform: translateY(50px);
		animation: slide-up 0.6s ease-out forwards; 
		padding: 0.5rem;
	}

	.product-card.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.product-image-container {
		position: relative;
		overflow: hidden;
		aspect-ratio: 3/4;
	}

	.product-image {
		height: 100%;
		width: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.product-card:hover .product-image {
		transform: scale(1.05);
	}

	.product-title {
		font-size: clamp(14px, 2.5vw, 16px);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-price {
		font-size: clamp(13px, 2.5vw, 15px);
		font-weight: 600;
	}

	.size-selection {
		margin-top: 0.5rem;
	}

	.size-indicator {
		width: auto;
		min-width: 30px;
		height: 24px;
		padding: 0 5px;
		border-radius: 2px;
		border: 1px solid #ddd;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		background-color: transparent;
		cursor: pointer;
	}

	@media (max-width: 576px) {
		.size-indicator {
			min-width: 26px;
			height: 22px;
			font-size: 11px;
			padding: 0 3px;
		}
	}

	.size-indicator.available {
		background-color: #f8f9fa;
		color: #212529;
	}

	.size-indicator.unavailable {
		background-color: #f8f9fa;
		color: #adb5bd;
		text-decoration: line-through;
		opacity: 0.7;
		cursor: not-allowed;
	}

	.size-indicator.selected {
		background-color: #212529;
		color: white;
		border-color: #212529;
	}

	.hover-underline {
		position: relative;
		display: inline-block;
		font-weight: 500;
	}

	.hover-underline:before, .hover-underline.active:before {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 2px; 
		background-color: #000000; 
		transition: width 0.3s ease;
	}

	.hover-underline.active:before {
		width: 100%;
	}

	.hover-underline:hover:before {
		width: 100%;
	}

	.product-carousel {
		overflow: hidden;
		position: relative;
		touch-action: pan-y;
	}

	.carousel-track {
		display: flex;
		width: 100%;
	}

	.carousel-slide {
		flex: 0 0 100%;
		width: 100%;
	}

	.carousel-navigation-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.carousel-nav-arrow {
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid #e0e0e0;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 2;
	}

	.carousel-nav-arrow:hover {
		background: rgba(240, 240, 240, 1);
	}

	.arrow-icon {
		font-size: 18px;
		line-height: 1;
	}

	.carousel-dot {
		width: 8px;
		height: 8px;
		background-color: #ccc;
		border-radius: 50%;
		margin: 0 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.carousel-dot.active {
		background-color: #333;
	}

	@media (max-width: 576px) {
		.carousel-nav-arrow {
			width: 32px;
			height: 32px;
		}

		.arrow-icon {
			font-size: 16px;
		}

		.carousel-dot {
			width: 6px;
			height: 6px;
			margin: 0 3px;
		}
	}
</style>