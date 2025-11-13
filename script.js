const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const resultDiv = document.getElementById("result");

const API_KEY = "e6a5d8cd"; // OMDb API key

// 🧠 Show skeletons while loading
function showSkeletons(count = 6) {
  resultDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "card skeleton-card";
    skeleton.innerHTML = `
      <div class="skeleton skeleton-poster"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
    `;
    resultDiv.appendChild(skeleton);
  }
}

async function searchMovie(query = "") {
  showSkeletons();

  try {
    let searchUrl;
    if (/^\d{4}$/.test(query)) {
      searchUrl = `https://www.omdbapi.com/?s=movie&y=${query}&type=movie&apikey=${API_KEY}`;
    } else {
      searchUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`;
    }

    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.Response === "False" || !data.Search) {
      resultDiv.innerHTML = "<p>No results found!</p>";
      return;
    }

    resultDiv.innerHTML = "";

    for (const movie of data.Search.slice(0, 9)) {
      const detailsRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
      const details = await detailsRes.json();

      const { Title, Year, Poster, imdbID, imdbRating } = details;

      const card = document.createElement("div");
      card.className = "card fade-in";
      card.innerHTML = `
        <img src="${Poster !== "N/A" ? Poster : "https://via.placeholder.com/300x450?text=No+Image"}"
             alt="${Title}" class="movie-poster" data-id="${imdbID}" />
        <h2 class="movie-title">${Title}</h2>
        <p class="movie-year">${Year}</p>
        <p class="movie-rating">⭐ ${imdbRating || "N/A"}</p>
      `;

      card.querySelector("img").addEventListener("click", () => {
        window.location.href = `details.html?id=${imdbID}`;
      });

      resultDiv.appendChild(card);
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p>Something went wrong. Please try again later.</p>";
  }
}

async function loadRecentMovies() {
  const year = new Date().getFullYear();
  await searchMovie(year);
}

searchBtn.addEventListener("click", () => searchMovie(movieInput.value.trim()));
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMovie(movieInput.value.trim());
});

loadRecentMovies();
