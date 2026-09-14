document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navbar Toggle
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Close menu on link click for mobile screens
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // 2. Mock Feed Data
  const mockPosts = [
    {
      id: 1,
      author: "Elena Rostova",
      handle: "@elena_explores",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      location: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      text: "Wandering through the serene bamboo forests of Arashiyama at dawn. The morning light filtering through the stalks is pure magic! 🎋✨",
      likes: 124,
      liked: false
    },
    {
      id: 2,
      author: "Marcus Vance",
      handle: "@vance_voyages",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      location: "Reykjavik, Iceland",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80",
      text: "Chased the Northern Lights across the black sand beaches of Vik last night. Mother Nature never ceases to amaze. 🌌❄️",
      likes: 342,
      liked: true
    },
    {
      id: 3,
      author: "Chloe Bennett",
      handle: "@chloe_journals",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      location: "Amalfi Coast, Italy",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      text: "Sipping limoncello overlooking the cliffside pastel houses of Positano. Italian summer is officially my happy place. 🍋🇮🇹",
      likes: 215,
      liked: false
    }
  ];

  // Render Mock Feed
  const feedContainer = document.getElementById("feed-container");

  function renderFeed() {
    feedContainer.innerHTML = "";
    mockPosts.forEach(post => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";
      postCard.innerHTML = `
                <div class="post-header">
                    <div class="post-author-info">
                        <img src="${post.avatar}" alt="${post.author}" class="post-avatar">
                        <div>
                            <h4>${post.author}</h4>
                            <span class="post-location"><i class="fa-solid fa-location-dot"></i> ${post.location}</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-ellipsis" style="color: var(--text-muted); cursor: pointer;"></i>
                </div>
                <img src="${post.image}" alt="Post image" class="post-image">
                <div class="post-content">
                    <p>${post.text}</p>
                    <div class="post-actions">
                        <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}">
                            <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> 
                            <span class="like-count">${post.likes}</span>
                        </button>
                        <button class="action-btn">
                            <i class="fa-regular fa-comment"></i> Comment
                        </button>
                        <button class="action-btn" style="margin-left: auto;">
                            <i class="fa-regular fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            `;
      feedContainer.appendChild(postCard);
    });

    // Bind like interactions after rendering
    document.querySelectorAll(".like-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const postId = parseInt(btn.getAttribute("data-id"));
        const targetPost = mockPosts.find(p => p.id === postId);
        if (targetPost) {
          if (targetPost.liked) {
            targetPost.liked = false;
            targetPost.likes -= 1;
          } else {
            targetPost.liked = true;
            targetPost.likes += 1;
          }
          renderFeed();
        }
      });
    });
  }

  renderFeed();

  // 3. Follow / Unfollow Button Interaction
  const followBtn = document.getElementById("follow-btn");
  const followerCountSpan = document.getElementById("follower-count");
  let isFollowing = false;
  let baseFollowers = 1420;

  if (followBtn) {
    followBtn.addEventListener("click", () => {
      isFollowing = !isFollowing;
      if (isFollowing) {
        followBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> Following`;
        followBtn.style.background = "#2ec4b6";
        baseFollowers += 1;
      } else {
        followBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Follow Traveler`;
        followBtn.style.background = "var(--primary)";
        baseFollowers -= 1;
      }
      followerCountSpan.textContent = baseFollowers.toLocaleString();
    });
  }

  // 4. Destination Discovery Search & Filter
  const destinations = [
    {
      title: "Kyoto, Japan",
      region: "Asia",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
      badge: "Cultural Hotspot",
      story: "“Visited the Fushimi Inari shrine at dusk. Walking through thousands of vermilion torii gates felt like stepping into another dimension.” — @alex_wanders"
    },
    {
      title: "Reykjavik, Iceland",
      region: "Europe",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=400&q=80",
      badge: "Adventure",
      story: "“Soaked in the Blue Lagoon while snow fell softly around us. A surreal geothermal wonderland.” — @vance_voyages"
    },
    {
      title: "Bali, Indonesia",
      region: "Island",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
      badge: "Tropical",
      story: "“Woke up to sunrise yoga overlooking the Ubud rice terraces, followed by fresh coconut water.” — @elena_explores"
    },
    {
      title: "Amalfi Coast, Italy",
      region: "Europe",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80",
      badge: "Scenic Escape",
      story: "“Rented a vintage Vespa and cruised along winding coastal roads high above the Tyrrhenian Sea.” — @chloe_journals"
    },
    {
      title: "Swiss Alps, Switzerland",
      region: "Europe",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=400&q=80",
      badge: "Mountain Peak",
      story: "“Hiked up to view the Matterhorn at sunrise. The crisp alpine air and golden peak views are unforgettable.” — @alex_wanders"
    },
    {
      title: "Phuket, Thailand",
      region: "Asia",
      image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=400&q=80",
      badge: "Island",
      story: "“Chartered a longtail boat to explore hidden limestone lagoons in Phang Nga Bay.” — @vance_voyages"
    }
  ];

  const destinationsGrid = document.getElementById("destinations-grid");
  const searchInput = document.getElementById("destination-search");
  const filterChips = document.querySelectorAll(".filter-chip");
  let currentFilter = "all";
  let searchQuery = "";

  function renderDestinations() {
    destinationsGrid.innerHTML = "";

    const filtered = destinations.filter(dest => {
      const matchesFilter = currentFilter === "all" || dest.region === currentFilter;
      const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.story.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      destinationsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">No destinations found matching your search.</p>`;
      return;
    }

    filtered.forEach(dest => {
      const card = document.createElement("div");
      card.className = "destination-card";
      card.innerHTML = `
                <div class="destination-img-wrap">
                    <img src="${dest.image}" alt="${dest.title}">
                    <span class="destination-badge">${dest.badge}</span>
                </div>
                <div class="destination-body">
                    <h3>${dest.title}</h3>
                    <p><i class="fa-solid fa-map-pin" style="color: var(--primary);"></i> Region: ${dest.region}</p>
                    <div class="destination-story">${dest.story}</div>
                </div>
            `;
      destinationsGrid.appendChild(card);
    });
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderDestinations();
    });
  }

  // Filter Chips Listener
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      renderDestinations();
    });
  });

  // Initial load for destinations
  renderDestinations();
});