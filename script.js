/* ============================================================
   script.js — XVII da Amanda
   ============================================================ */

const TOTAL_TILES = 16;
const DELAY_BEFORE_TRANSITION = 1800; // ms to read last adjective

const grid = document.getElementById("adjectiveGrid");
const hint = document.getElementById("hint");
const photoSection = document.getElementById("photoSection");
const photo = document.getElementById("photo");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const photoSwitch = document.getElementById("photoSwitch");
const photoHeartsOverlay = document.getElementById("photoHeartsOverlay");
const heartsBg = document.getElementById("heartsBg");

const PHOTO_AMANDA = "images/foto-amanda.jpg";
const PHOTO_US = "images/foto-nos.jpg";

let selectedCount = 0;
let allSelected = false;

// ── Floating background hearts ──────────────────────────────
const HEART_CHARS = ["♡", "♥", "❤️", "💕", "💗", "💖", "🌸"];

function spawnBackgroundHeart() {
  const el = document.createElement("span");
  el.classList.add("heart-float");
  el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  el.style.left = Math.random() * 100 + "vw";
  const duration = 8 + Math.random() * 10; // 8–18 s
  el.style.animationDuration = duration + "s";
  el.style.animationDelay = Math.random() * -duration + "s";
  el.style.fontSize = 0.8 + Math.random() * 1.2 + "rem";
  heartsBg.appendChild(el);

  // Remove after two cycles so we don't accumulate DOM nodes
  setTimeout(() => el.remove(), (duration * 2 + 2) * 1000);
}

// Seed initial hearts then keep adding
for (let i = 0; i < 18; i++) spawnBackgroundHeart();
setInterval(spawnBackgroundHeart, 1200);

// ── Tile click handler ───────────────────────────────────────
grid.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile || allSelected) return;

  if (!tile.classList.contains("selected")) {
    tile.classList.add("selected");
    selectedCount++;
    spawnTileHeart(tile);
  }

  if (selectedCount === TOTAL_TILES) {
    allSelected = true;
    hint.classList.add("hidden");
    setTimeout(revealPhoto, DELAY_BEFORE_TRANSITION);
  }
});

// Small heart pop on each tile click
function spawnTileHeart(tile) {
  const rect = tile.getBoundingClientRect();
  const el = document.createElement("span");
  el.textContent = "❤️";
  el.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top}px;
    font-size: 1.1rem;
    pointer-events: none;
    z-index: 100;
    animation: popHeart 0.8s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// Inline keyframe for tile heart pop
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes popHeart {
    0%   { transform: translateY(0) scale(0.5); opacity: 1; }
    100% { transform: translateY(-55px) scale(1.1); opacity: 0; }
  }
`;
document.head.appendChild(styleTag);

// ── Photo reveal ─────────────────────────────────────────────
function revealPhoto() {
  photoSection.classList.add("visible");

  // Burst of hearts over the photo area
  setTimeout(burstHeartsOnPhoto, 600);
}

function burstHeartsOnPhoto() {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.classList.add("burst-heart");
    el.textContent =
      HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    const angle = (i / count) * 2 * Math.PI;
    const radius = 60 + Math.random() * 120;
    el.style.setProperty("--tx", `${Math.cos(angle) * radius}px`);
    el.style.setProperty("--ty", `${Math.sin(angle) * radius}px`);
    el.style.left = "50%";
    el.style.top = "50%";
    el.style.animationDelay = Math.random() * 0.5 + "s";
    photoHeartsOverlay.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
}

// ── Photo error / placeholder ────────────────────────────────
photo.addEventListener("error", () => {
  photo.classList.add("errored");
  photoPlaceholder.style.display = "flex";
});

// Update placeholder text based on which photo is active
function updatePlaceholderText(isUs) {
  const code = photoPlaceholder.querySelector("code");
  if (code) {
    code.textContent = isUs ? "images/foto-nos.jpg" : "images/foto-amanda.jpg";
  }
}

// ── Photo toggle ─────────────────────────────────────────────
photoSwitch.addEventListener("change", () => {
  const isUs = photoSwitch.checked;

  // Fade out
  photo.classList.add("fade-out");
  photoPlaceholder.style.display = "none";
  photo.classList.remove("errored");

  setTimeout(() => {
    photo.src = isUs ? PHOTO_US : PHOTO_AMANDA;
    updatePlaceholderText(isUs);

    // Fade back in (after src change triggers load)
    photo.classList.remove("fade-out");
  }, 380);
});
