<script lang="ts">
	import { onMount } from 'svelte';
	import { saveProduct, getProducts } from '$lib/firebase/firebase';
	import { uploadImage } from '$lib/cloudinary';

	// Define proper interfaces
	interface StoredProduct {
		id: number | string;
		name: string;
		price: number;
		image: string | null;
		sizes: string[];
		availableSizes: string[];
		category: string[];
	}

	interface Product {
		id: number | string;
		name: string;
		price: number;
		image: string | null; // Changed to allow null values
		sizes: string[];
		availableSizes: string[];
		category: string[];
	}

	interface NewProduct {
		name: string;
		price: string | number;
		image: string | null;
		sizes: string[];
		availableSizes: string[];
		category: string[]; // Add this line
	}

	let loading = true;
	let errorMessage = '';

	let newProduct: NewProduct = {
		name: '',
		price: '',
		image: null,
		sizes: [],
		availableSizes: [],
		category: []
	};

	let showModal = false;
	let showSuccessMessage = false;
	let productList: Product[] = [];

	const sortOptions = [
		'Best selling',
		'Price: Low to High',
		'Price: High to Low',
		'Alphabetically: A-Z',
		'Alphabetically: Z-A'
	];
	let selectedSort = sortOptions[0];

	function sortProducts(): void {
		let sortedList = [...productList];

		switch (selectedSort) {
			case 'Price: Low to High':
				sortedList.sort((a, b) => a.price - b.price);
				break;
			case 'Price: High to Low':
				sortedList.sort((a, b) => b.price - a.price);
				break;
			case 'Alphabetically: A-Z':
				sortedList.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'Alphabetically: Z-A':
				sortedList.sort((a, b) => b.name.localeCompare(a.name));
				break;
		}

		productList = sortedList;
	}

	$: if (selectedSort && productList.length > 0) {
		sortProducts();
	}

	function isSizeAvailable(productSizes: string[], size: string): boolean {
		return productSizes.includes(size);
	}

	function toggleModal(): void {
		showModal = !showModal;
	}

	async function handleImageChange(event: Event): Promise<void> {
		const target = event.target as HTMLInputElement;
		if (target && target.files && target.files.length > 0) {
			const file = target.files[0];
			if (file) {
				try {
					console.log('Mulai upload gambar...');
					// Upload gambar ke Cloudinary dan dapatkan URL-nya
					const imageUrl = await uploadImage(file);
					console.log('Upload gambar berhasil:', imageUrl); // Pastikan URL yang valid dikembalikan
					newProduct.image = imageUrl; // Simpan URL gambar Cloudinary
				} catch (error) {
					console.error('Error uploading image:', error);
					alert('Terjadi kesalahan saat mengupload gambar.');
				}
			}
		}
	}

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		if (!newProduct.image || newProduct.image.startsWith('blob:')) {
			alert('Gambar produk belum berhasil diupload.');
			return; // Jangan lanjutkan jika gambar belum diupload dengan benar
		}

		const newProductItem: Product = {
			id: 0, // This will be replaced by the actual ID from saveProduct
			name: newProduct.name,
			price: parseFloat(newProduct.price as string),
			image: newProduct.image, // Gambar sudah valid, simpan URL Cloudinary
			sizes: [...newProduct.sizes],
			availableSizes: [...newProduct.availableSizes],
			category: [...newProduct.category]
		};

		try {
			const productId = await saveProduct(newProductItem);
			productList = [...productList, { ...newProductItem, id: productId }];
			newProduct = {
				name: '',
				price: '',
				image: null,
				sizes: [],
				availableSizes: [],
				category: []
			};
			toggleModal();
			showSuccessMessage = true;
			setTimeout(() => {
				showSuccessMessage = false;
			}, 3000);
		} catch (error) {
			console.error('Error adding product:', error);
			alert('Gagal menambahkan produk. Silakan coba lagi.');
		}
	}

	onMount(async () => {
		try {
			loading = true;
			const products = await getProducts();

			if (products && products.length > 0) {
				productList = products;
				sortProducts();
			} else {
				productList = [...hoodies];
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			errorMessage = 'Gagal memuat produk dari database. Menampilkan data cadangan.';
			productList = [...hoodies];
		} finally {
			loading = false;
		}

		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
		script.integrity = 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL';
		script.crossOrigin = 'anonymous';
		document.body.appendChild(script);
	});
</script>

<svelte:head>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
		rel="stylesheet"
	/>
</svelte:head>

<div class="container-fluid mt-4 mb-5">
	<div class="row">
		<div class="col-12">
			<h1 class="display-5 fw-bold">SHOP ALL</h1>
		</div>
	</div>

	<div class="row mt-4 mb-4">
		<div class="d-flex justify-content-end col-12">
			<div class="d-flex align-items-center">
				<button class="btn btn-primary" on:click={toggleModal}> Tambah Product </button>
				<div class="dropdown ms-3">
					<button
						class="btn btn-outline-dark dropdown-toggle"
						type="button"
						id="sortDropdown"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						{selectedSort}
					</button>
					<ul class="dropdown-menu" aria-labelledby="sortDropdown">
						{#each sortOptions as option}
							<li>
								<button
									class="dropdown-item {option === selectedSort ? 'active' : ''}"
									on:click={() => (selectedSort = option)}
								>
									{option}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="row">
			<div class="col-12 py-5 text-center">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-2">Memuat produk dari database...</p>
			</div>
		</div>
	{:else if errorMessage}
		<div class="row">
			<div class="col-12">
				<div class="alert alert-warning" role="alert">
					{errorMessage}
				</div>
			</div>
		</div>
	{/if}

	<div class="row g-4">
		{#each productList as product}
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
						{#each product.sizes as size}
							<div
								class="size-indicator me-1 mb-1 {isSizeAvailable(product.availableSizes, size)
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
				<p>Tidak ada produk untuk ditampilkan</p>
			</div>
		{/each}
	</div>
</div>

{#if showModal}
	<div class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Tambah Produk</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						on:click={toggleModal}
					></button>
				</div>
				<div class="modal-body">
					<form on:submit={handleSubmit}>
						<div class="mb-3">
							<label for="name" class="form-label">Nama Produk</label>
							<input
								type="text"
								class="form-control"
								id="name"
								bind:value={newProduct.name}
								required
							/>
						</div>
						<div class="mb-3">
							<label for="price" class="form-label">Harga Produk</label>
							<input
								type="number"
								class="form-control"
								id="price"
								bind:value={newProduct.price}
								required
							/>
						</div>
						<div class="mb-3">
							<label for="image" class="form-label">Gambar Produk</label>
							<input
								type="file"
								class="form-control"
								id="image"
								on:change={handleImageChange}
								accept="image/*"
								required
							/>
						</div>
						<div class="mb-3">
							<label for="category" class="form-label">Kategori</label>
							<div class="d-flex gap-2" id="category">
								{#each ['Hoodie', 'Sweatshirt'] as category}
									<button
										type="button"
										class="btn btn-sm {newProduct.category.includes(category)
											? 'btn-dark'
											: 'btn-outline-dark'}"
										on:click={() => {
											if (newProduct.category.includes(category)) {
												newProduct.category = newProduct.category.filter((c) => c !== category);
											} else {
												newProduct.category = [...newProduct.category, category];
											}
										}}
									>
										{category}
									</button>
								{/each}
							</div>
							<div class="mb-3">
								<label for="sizes" class="form-label">Pilih Ukuran</label>
								<div class="d-flex gap-2" id="sizes">
									{#each ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'] as size}
										<button
											type="button"
											class="btn btn-sm {newProduct.sizes.includes(size)
												? 'btn-dark'
												: 'btn-outline-dark'}"
											on:click={() => {
												if (newProduct.sizes.includes(size)) {
													newProduct.sizes = newProduct.sizes.filter((s) => s !== size);
												} else {
													newProduct.sizes = [...newProduct.sizes, size];
												}
											}}
										>
											{size}
										</button>
									{/each}
								</div>
							</div>
							<div class="mb-3">
								<label for="availableSizes" class="form-label">Ukuran Tersedia</label>
								<div class="d-flex gap-2" id="availableSizes">
									{#each ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'] as size}
										<button
											type="button"
											class="btn btn-sm {newProduct.availableSizes.includes(size)
												? 'btn-dark'
												: 'btn-outline-dark'}"
											on:click={() => {
												if (newProduct.availableSizes.includes(size)) {
													newProduct.availableSizes = newProduct.availableSizes.filter(
														(s) => s !== size
													);
												} else {
													newProduct.availableSizes = [...newProduct.availableSizes, size];
												}
											}}
										>
											{size}
										</button>
									{/each}
								</div>
							</div>
							<button type="submit" class="btn btn-primary">Tambah Produk</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if showSuccessMessage}
	<div class="toast-container position-fixed end-0 top-0 p-3">
		<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header">
				<strong class="me-auto">Success</strong>
				<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">Produk berhasil ditambahkan!</div>
		</div>
	</div>
{/if}

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
</style>
