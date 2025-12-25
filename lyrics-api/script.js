const artistInput = document.getElementById("artist");
const titleInput = document.getElementById("title");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const lyricsBox = document.getElementById("lyricsBox");
const themeToggle = document.getElementById("themeToggle");

/* ==========================
   THEME
========================== */
function initTheme() {
  const saved = localStorage.getItem("lyrics_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  themeToggle.textContent = saved === "light" ? "🌙" : "☀️";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("lyrics_theme", next);
  themeToggle.textContent = next === "light" ? "🌙" : "☀️";
}

themeToggle.addEventListener("click", toggleTheme);

/* ==========================
   FETCH LYRICS
========================== */
async function fetchLyrics(artist, title) {
  statusEl.textContent = "Loading lyrics...";
  lyricsBox.textContent = "";

  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(
      artist
    )}/${encodeURIComponent(title)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.lyrics) {
      statusEl.textContent = `Lyrics for "${title}" by ${artist}`;
      lyricsBox.textContent = data.lyrics;
    } else {
      statusEl.textContent = "No lyrics found 😢";
      lyricsBox.textContent = "";
    }
  } catch (err) {
    statusEl.textContent = "Error fetching lyrics. Try again.";
  }
}

/* ==========================
   EVENTS
========================== */
searchBtn.addEventListener("click", () => {
  const artist = artistInput.value.trim();
  const title = titleInput.value.trim();

  if (!artist || !title) {
    statusEl.textContent = "Please enter both artist and title.";
    return;
  }

  fetchLyrics(artist, title);
});

titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

/* ==========================
   INIT
========================== */
initTheme();
