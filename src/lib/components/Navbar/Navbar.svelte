<script lang="ts">
	import './Navbar.css';

	const menuItems = [
		{ name: 'Shop', link: '/shop' },
		{ name: 'Category', link: '/category' },
		{ name: 'About', link: '/about' }
	];
</script>

<nav class="navbar navbar-expand-lg navbar-dark w-100 bg-gray-200">
	<div class="container">
		<div class="d-flex justify-content-between align-items-center w-100">
			<!-- Brand -->
			<a class="navbar-brand fw-bolder mx-auto text-black" href="/">HURTS-SPACE</a>
		</div>
	</div>
</nav>

<!-- Menu items -->
<div class="w-100 bg-gray-200">
	<div class="container">
		<ul class="nav justify-content-center">
			{#each menuItems as item}
				<li class="nav-item">
					<a
						class="nav-link fw-bold nav-hover-effect text-black opacity-75"
						href={item.link}
						style="letter-spacing: 1px;"
					>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
