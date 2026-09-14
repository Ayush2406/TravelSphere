javascript
// Small interactions for the static TravelSphere prototype

const navButtons = document.querySelectorAll(".side-link");
const views = {
    feed: document.getElementById("feed-view"),
    discover: document.getElementById("discover-view"),
    profile: document.getElementById("profile-view")
};

const viewTitle = document.getElementById("view-title");

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedView = button.dataset.view;

        navButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        Object.values(views).forEach(view => {
            view.classList.add("hidden");
        });

        views[selectedView].classList.remove("hidden");

        const titles = {
            feed: "Latest from travelers",
            discover: "Explore destinations",
            profile: "Your traveler profile"
        };

        viewTitle.textContent = titles[selectedView];
    });
});


// Like buttons
document.querySelectorAll(".like-button").forEach(button => {
    button.addEventListener("click", () => {
        const liked = button.classList.toggle("liked");

        const currentText = button.textContent;
        const number = parseInt(currentText.match(/\d+/)[0]);

        button.textContent = liked
            ? `♥ ${number + 1}`
            : `♡ ${number}`;
    });
});


// Follow/Edit Profile demo button
const followButton = document.querySelector(".follow-button");

if (followButton) {
    followButton.addEventListener("click", () => {
        followButton.textContent =
            followButton.textContent === "Edit Profile"
                ? "Profile Ready ✓"
                : "Edit Profile";
    });
}


// Destination search demo
const searchInput = document.getElementById("destination-search");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        document.querySelectorAll(".destination-card").forEach(card => {
            const name = card.querySelector("h4").textContent.toLowerCase();

            card.style.display = name.includes(query) ? "block" : "none";
        });
    });
}


// Notification demo
const notification = document.querySelector(".notification");

if (notification) {
    notification.addEventListener("click", () => {
        notification.textContent =
            notification.textContent === "🔔" ? "✓" : "🔔";
    });
}

