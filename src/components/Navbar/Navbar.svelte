<script lang="ts">
  
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

<div class="position-relative vh-100 overflow-hidden" style="background-image: url('/images/1,2.jpg'); background-size: cover; background-position: center;">
  <!-- Overlay untuk membuat gambar sedikit lebih gelap -->
  <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark" style="opacity: 0.1;"></div>
  
  <!-- Navbar transparan -->
  <nav class="navbar navbar-expand-lg navbar-dark position-absolute top-0 start-0 w-100" style="z-index: 1000;">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center w-100">
        <!-- Search Icon -->
        <div>
          <button class="btn text-white p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <!-- Brand -->
        <a class="navbar-brand text-white fw-bold mx-auto" href="/">Hurts-Space</a>
        
        <!-- User Icons -->
        <div class="d-flex">
          <button class="btn text-white p-0 me-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <button class="btn text-white p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Menu items -->
  <div class="position-absolute w-100" style="top: 80px; z-index: 1000;">
    <div class="container">
      <ul class="nav justify-content-center">
        {#each menuItems as item}
          <li class="nav-item">
            <a class="nav-link text-white opacity-75 fw-light" href={item.link} style="letter-spacing: 1px;">{item.name}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  
  <!-- Hero content -->
  <div class="container h-100 position-relative">
    <div class="position-absolute" style="bottom: 100px; left: 50px;">
      <h1 class="display-3 text-white fw-bold mb-4">BEST SELLERS</h1>
      <a href="#shop" class="btn btn-outline-light px-4 py-2">
        SHOP NOW <span class="ms-2">→</span>
      </a>
    </div>
  </div>
</div>

<style>
  :global(body) {
    font-family: 'Montserrat', sans-serif;
  }

  .navbar, .nav-link, h1, a, button {
    font-family: 'Montserrat', sans-serif;
  }
</style>
