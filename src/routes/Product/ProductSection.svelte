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
		category: string; // Tambahkan kategori
	};

	let products: Product[] = [];
	let filteredProducts: Product[] = []; // Produk yang sudah difilter berdasarkan kategori
	let loading = true;
	let error = false;
	let currentSlide = 0;
	let itemsPerSlide = 5;
	let selectedCategory = ''; // Menyimpan kategori yang dipilih
	let selectedSize: Record<string, string> = {};

	let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

	// Fetch products from backend and debug image URLs
	onMount(async () => {
		try {
			loading = true;
			const fetchedProducts = await getProducts();
			products = fetchedProducts;
			filteredProducts = products; // Menampilkan semua produk awalnya

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

  // Check for valid category
  if (category === 'Hoodie' || category === 'Sweatshirt') {
    // Filter products based on category
    filteredProducts = products.filter((product) => product.category.includes(category));
	console.log(filteredProducts)
  } else {
    // If an invalid category is passed, you can handle it by resetting or showing all products
    filteredProducts = products; // Show all products if no valid category is selected
  }
}

	// Format price to IDR
	function formatPrice(price: number): string {
		return `IDR ${price.toLocaleString('id-ID')}`;
	}

	// Handle resize for responsiveness
	function handleResize() {
		windowWidth = window.innerWidth;
	}

	function nextProductSlide() {
		const maxSlides = Math.ceil(filteredProducts.length / itemsPerSlide) - 1;
		currentSlide = currentSlide >= maxSlides ? 0 : currentSlide + 1;
	}

	function prevProductSlide() {
		const maxSlides = Math.ceil(filteredProducts.length / itemsPerSlide) - 1;
		currentSlide = currentSlide <= 0 ? maxSlides : currentSlide - 1;
	}

	// Show only current slide's products
	$: visibleProducts = filteredProducts.slice(
		currentSlide * itemsPerSlide,
		Math.min((currentSlide + 1) * itemsPerSlide, filteredProducts.length)
	);
</script>

<svelte:window on:resize={handleResize} />

<section class="products-section position-relative py-5">
	<div class="container-fluid px-4">
		<!-- Filter Buttons -->
		<div class="d-flex mb-4">
			<span
				class="hover-underline me-2"
				style="color: Black; cursor: pointer;"
				on:click={() => filterByCategory('Hoodie')}
			>
				Hoodie
			</span>
			<span
				class="hover-underline me-2"
				style="color: black; cursor: pointer;"
				on:click={() => filterByCategory('Sweatshirt')}
			>
				Sweatshirt
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
			<!-- External Navigation Arrows -->
			<button
				class="carousel-nav-arrow carousel-nav-prev d-none d-md-flex"
				on:click={prevProductSlide}
				aria-label="Previous products"
			>
				<!-- Previous arrow icon here -->
			</button>

			<button
				class="carousel-nav-arrow carousel-nav-next d-none d-md-flex"
				on:click={nextProductSlide}
				aria-label="Next products"
			>
				<!-- Next arrow icon here -->
			</button>

			<div class="product-carousel">
				<div class="carousel-track" style="transform: translateX(-{currentSlide * 100}%);">
					{#each Array(Math.ceil(filteredProducts.length / itemsPerSlide)) as _, slideIndex}
						<div class="carousel-slide">
							<div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
								{#each filteredProducts.slice(slideIndex * itemsPerSlide, Math.min((slideIndex + 1) * itemsPerSlide, filteredProducts.length)) as product}
									<div class="col">
										<div class="product-card h-100">
											<a href="/product/{product.id}" class="text-decoration-none text-dark">
												<div class="product-image-container mb-3">
													<img
														src={product.image || 'default-image.jpg'}
														alt={product.name}
														class="product-image w-100"
													/>
												</div>
												<h3 class="h6 mb-1">{product.name}</h3>
												<p class="fw-bold mb-2">{formatPrice(product.price)}</p>
											</a>
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
	.product-image-container {
		position: relative;
		overflow: hidden;
	}

	.product-image {
		height: 400px;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.product-card:hover .product-image {
		transform: scale(1.05);
	}

	.size-indicator {
		width: auto;
		min-width: 30px;
		height: 22px;
		padding: 0 5px;
		border-radius: 2px;
		border: 1px solid #ddd;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
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
	}

	.hover-underline {
		position: relative;
		display: inline-block;
	}

	.hover-underline:before {
		content: '';
		position: absolute;
		bottom: 0px;
		left: 0;
		width: 0;
		height: 2px; /* thickness of the underline */
		background-color: #000000; /* green underline color */
		transition: width 0.3s ease;
	}

	.hover-underline:hover:before {
		width: 100%;
	}
</style>
