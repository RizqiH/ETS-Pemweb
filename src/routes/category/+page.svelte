<script lang="ts">
	import { onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { getProducts } from '$lib/firebase/firebase';

	// Interface for product structure
	interface Product {
		id: string | number;
		name: string;
		price: number;
		image: string | null;
		sizes: string[];
		availableSizes: string[];
		category: string[];
	}

	const category = {
		name: 'Hoodies & Sweatshirts',
		description:
			'Stay comfortable and stylish with our collection of premium hoodies and sweatshirts.'
	};

	let loading = true;
	let errorMessage = '';
	let productList: Product[] = [];

	let filters = {
		priceRange: 'all',
		color: 'all',
		sortBy: 'newest'
	};

	const menuItems = [
		{ name: 'NEW', link: '#new' },
		{ name: 'SHOP', link: '#shop' },
		{ name: 'YK MOVE', link: '#yk-move' },
		{ name: 'BUNDLES', link: '#bundles' },
		{ name: 'LAST CHANCE', link: '#last-chance' },
		{ name: 'THE SAFE', link: '#the-safe' },
		{ name: 'STORE', link: '#store' },
		{ name: 'MEMBERS CLUB', link: '#members-club' }
	];

	function isSizeAvailable(productSizes: string[], size: string): boolean {
		return productSizes.includes(size);
	}

	function filterProducts() {
		return productList.filter(
			(product) =>
				(product.category && product.category.includes('Hoodie')) ||
				product.category.includes('Sweatshirt')
		);
	}

	onMount(async () => {
		try {
			loading = true;
			const products = await getProducts();

			if (products && products.length > 0) {
				productList = products;
			} else {
				errorMessage = 'No products found in database.';
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			errorMessage = 'Failed to load products from database.';
		} finally {
			loading = false;
		}
	});
</script>

<main>
	<section class="bg-light py-5">
		<div class="container text-center">
			<h1 class="display-5 mb-3">{category.name}</h1>
			<p class="lead">{category.description}</p>
		</div>
	</section>

	<section class="border-bottom py-4">
		<div class="container">
			<div class="row">
				<div class="col-md-4"></div>
				<div class="col-md-4">
					<select class="form-select" bind:value={filters.sortBy}>
						<option value="newest">Sort by: Newest</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
					</select>
				</div>
			</div>
		</div>
	</section>

	{#if loading}
		<div class="container py-5 text-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p class="mt-2">Loading products from database...</p>
		</div>
	{:else if errorMessage}
		<div class="container">
			<div class="alert alert-warning" role="alert">
				{errorMessage}
			</div>
		</div>
	{:else}
		<section class="py-5">
			<div class="container">
				<div class="row g-4">
					{#each filterProducts() as product}
						<div class="col-md-3 col-6 mb-4">
							<a href="/product/{product.id}" class="text-decoration-none text-dark product-card">
								<div class="product-image-container mb-3">
									<img
										src={product.image || 'https://dummyimage.com/400x400/eee/999&text=No+Image'}
										alt={product.name}
										class="product-image w-100"
										on:error={(e) => {
											const target = e.target as HTMLImageElement;
											if (target) {
												target.src = 'https://dummyimage.com/400x400/eee/999&text=No+Image';
											}
										}}
									/>
								</div>
								<h3 class="h6 mb-1">{product.name}</h3>
								<p class="fw-bold mb-2">IDR {product.price.toLocaleString('id-ID')}</p>
								<div class="d-flex flex-wrap">
									{#each product.sizes || [] as size}
										<div
											class="size-indicator me-1 mb-1 {isSizeAvailable(
												product.availableSizes || [],
												size
											)
												? 'available'
												: 'unavailable'}"
										>
											{size}
										</div>
									{/each}
								</div>
							</a>
						</div>
					{:else}
						<div class="col-12 text-center py-5">
							<p>No products available in this category</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="pb-5">
			<div class="container text-center">
				<button class="btn btn-outline-dark px-5 py-2">LOAD MORE</button>
			</div>
		</section>
	{/if}
</main>

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

	.nav-link {
		letter-spacing: 0.5px;
		font-size: 14px;
	}
</style>
