<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';

	const category = {
		name: 'Hoodies & Sweatshirts',
		description:
			'Stay comfortable and stylish with our collection of premium hoodies and sweatshirts.'
	};

	const products = [
		{
			id: 1,
			name: 'Essential Hoodie',
			price: '$79.99',
			image: '/images/11.webp',
			colors: ['Grey', 'Black', 'Cream']
		},
		{
			id: 2,
			name: 'Oversized Sweatshirt',
			price: '$69.99',
			image: '/images/11.webp',
			colors: ['Black', 'Grey', 'Olive']
		},
		{
			id: 3,
			name: 'Graphic Print Hoodie',
			price: '$89.99',
			image: '/images/11.webp',
			colors: ['Black', 'White']
		},
		{
			id: 4,
			name: 'Zip-Up Hoodie',
			price: '$84.99',
			image: '/images/11.webp',
			colors: ['Navy', 'Black', 'Grey']
		},
		{
			id: 5,
			name: 'Heavyweight Sweatshirt',
			price: '$74.99',
			image: '/images/11.webp',
			colors: ['Black', 'Grey', 'Beige']
		},
		{
			id: 6,
			name: 'Cropped Hoodie',
			price: '$69.99',
			image: '/images/11.webp',
			colors: ['Grey', 'Black', 'Cream']
		},
		{
			id: 7,
			name: 'Premium Sweatshirt',
			price: '$79.99',
			image: '/images/13.webp',
			colors: ['Black', 'Grey', 'Cream']
		},
		{
			id: 8,
			name: 'Urban Hoodie',
			price: '$89.99',
			image: '/images/12.webp',
			colors: ['Black', 'Grey', 'Green']
		}
	];

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
				<div class="col-md-4">
					<select class="form-select mb-md-0 mb-3" bind:value={filters.priceRange}>
						<option value="all">Price: All</option>
						<option value="under-50">Under $50</option>
						<option value="50-100">$50 - $100</option>
						<option value="over-100">Over $100</option>
					</select>
				</div>
				<div class="col-md-4">
					<select class="form-select mb-md-0 mb-3" bind:value={filters.color}>
						<option value="all">Color: All</option>
						<option value="black">Black</option>
						<option value="grey">Grey</option>
						<option value="white">White</option>
						<option value="cream">Cream</option>
					</select>
				</div>
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

	<section class="py-5">
		<div class="container">
			<div class="row">
				{#each products as product}
					<div class="col-md-3 col-6 mb-4">
						<a href="/product/{product.id}" class="text-decoration-none text-dark product-card">
							<div class="product-image-container mb-3">
								<img src={product.image} alt={product.name} class="product-image w-100" />
							</div>
							<h3 class="h6 mb-1">{product.name}</h3>
							<p class="mb-2">{product.price}</p>
							<div class="d-flex">
								{#each product.colors as color}
									<div
										class="color-dot me-1"
										style={`background-color: ${color.toLowerCase()};`}
									></div>
								{/each}
							</div>
						</a>
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

	.color-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}

	.nav-link {
		letter-spacing: 0.5px;
		font-size: 14px;
	}
</style>
